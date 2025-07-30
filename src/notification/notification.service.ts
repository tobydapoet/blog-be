import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { RedisClientType } from 'redis';
import { Blog } from 'src/blog/entities/blog.entity';
import { Post } from 'src/post/entities/post.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Following } from 'src/following/entities/following.entity';
import { NotificationType } from './types/notification';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(Blog)
    private blogRepo: Repository<Blog>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(Favourite)
    private favouriteRepo: Repository<Favourite>,
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Following)
    private followingRepo: Repository<Following>,
    @Inject(`REDIS_CLIENT`) private readonly redisClient: RedisClientType,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationRepo.create(
      createNotificationDto,
    );
    const savedNotification = await this.notificationRepo.save(notification);
    if (savedNotification) {
      await this.redisClient.del(`notify-client:${notification.client.id}`);
    }
    return savedNotification;
  }

  handleTarget = async (notification: Notification) => {
    let target: Post | Blog | Comment | Following | Favourite | null = null;
    if (
      notification.type === NotificationType.COMMENT ||
      notification.type === NotificationType.COMMENTBLOG ||
      notification.type === NotificationType.COMMENTPOST
    ) {
      target = await this.commentRepo.findOne({
        where: { id: notification.refId },
      });
    } else if (
      notification.type === NotificationType.LIKEBLOG ||
      notification.type === NotificationType.LIKEPOST
    ) {
      target = await this.favouriteRepo.findOne({
        where: { id: notification.refId },
      });
    } else if (notification.type === NotificationType.NEWBLOG) {
      target = await this.blogRepo.findOne({
        where: { id: notification.refId },
      });
    } else if (notification.type === NotificationType.NEWPOST) {
      target = await this.postRepo.findOne({
        where: { id: notification.refId },
      });
    } else if (notification.type === NotificationType.FOLLOW) {
      target = await this.followingRepo.findOne({
        where: { id: notification.refId },
      });
    }
    return target;
  };

  async findByClient(clientId: number) {
    const cachedKey = `notify-client:${clientId}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const notifications = await this.notificationRepo.find({
      where: { client: { id: clientId } },
    });
    if (notifications) {
      await this.redisClient.set(cachedKey, JSON.stringify(notifications), {
        EX: 60 * 5,
      });
    }
    const result: Array<
      Notification & {
        target: Post | Blog | Comment | Following | Favourite | null;
      }
    > = [];
    for (const notification of notifications) {
      const target = await this.handleTarget(notification);
      result.push({ ...notification, target });
    }
    return result;
  }

  inactive(id: number) {
    return this.notificationRepo.update({ id }, { active: false });
  }

  async findOne(id: number) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException("Can't find this notification");
    }
    const target = await this.handleTarget(notification);
    return {
      notification,
      target,
    };
  }

  async remove(id: number) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    await this.redisClient.del(`notify-client:${notification.client.id}`);
    return this.notificationRepo.remove(notification);
  }
}
