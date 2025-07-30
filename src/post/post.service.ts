import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UploadCloundiaryService } from 'src/upload_cloundiary/upload_cloundiary.service';
import { ClientService } from 'src/client/client.service';
import { RedisClientType } from 'redis';
import { NotificationService } from 'src/notification/notification.service';
import { FollowingService } from 'src/following/following.service';
import { NotificationType } from 'src/notification/types/notification';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private notificationService: NotificationService,
    private followingService: FollowingService,
    private uploadService: UploadCloundiaryService,
    private clientService: ClientService,
  ) {}
  async create(createPostDto: CreatePostDto, files?: Express.Multer.File[]) {
    if (files?.length === 0 && !createPostDto.content) {
      throw new Error('Content can not be empty!');
    }
    const imagesList: string[] = [];
    if (files) {
      for (const file of files) {
        const imageUpload = await this.uploadService.uploadImage(
          file.buffer,
          'post',
        );
        imagesList.push(imageUpload.url);
      }
      createPostDto.images = imagesList;
    }

    const { clientId } = createPostDto;

    const client = await this.clientService.findOne(clientId);

    if (!client) throw new Error('Client not found');

    const post = this.postRepo.create({
      ...createPostDto,
      client,
    });

    const savedPost = await this.postRepo.save(post);
    if (savedPost) {
      await this.redisClient.del(`post:all`);
      await this.redisClient.del(`post-client:${createPostDto.clientId}`);
      const notifyFollowing =
        await this.followingService.findByFollowed(clientId);
      if (notifyFollowing) {
        for (const followers of notifyFollowing) {
          await this.notificationService.create({
            clientId: followers.follower.id,
            message: `${client.account.name} Just posted new news!`,
            refId: savedPost.id,
            type: NotificationType.NEWPOST,
          });
        }
      }
    }
    return savedPost;
  }

  async findAll() {
    const cachedKey = `post:all`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const posts = await this.postRepo.find();
    if (posts) {
      await this.redisClient.set(cachedKey, JSON.stringify(posts), {
        EX: 60 * 5,
      });
    }
    return posts;
  }

  findOne(id: number) {
    return this.postRepo.findOne({ where: { id } });
  }

  async findByClient(id: number) {
    const cachedKey = `post-client:${id}`;
    const cached = await this.redisClient.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const posts = this.postRepo.find({ where: { client: { id } } });
    if (posts) {
      await this.redisClient.set(cachedKey, JSON.stringify(posts), {
        EX: 60 * 5,
      });
    }
    return posts;
  }

  findMany(keyword: string) {
    return this.postRepo.find({
      where: [{ content: keyword }, { client: { account: { name: keyword } } }],
    });
  }

  async update(
    id: number,
    updatePostDto: Partial<UpdatePostDto>,
    files?: Express.Multer.File[],
  ) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new Error('Post not found');
    const imagesList: string[] = post.images || [];
    if (files) {
      for (const file of files) {
        const imageUpload = await this.uploadService.uploadImage(
          file.buffer,
          'post',
        );
        imagesList.push(imageUpload.url);
      }
      updatePostDto.images = imagesList;
    }
    await this.postRepo.update({ id }, updatePostDto);
    const updatedPost = await this.postRepo.findOne({ where: { id } });
    if (updatePostDto) {
      await this.redisClient.del(`post:all`);
      await this.redisClient.del(`post-client:${id}`);
    }
    return updatedPost;
  }
}
