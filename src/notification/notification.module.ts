import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { Blog } from 'src/blog/entities/blog.entity';
import { Following } from 'src/following/entities/following.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Blog,
      Following,
      Post,
      Comment,
      Favourite,
    ]),
    RedisModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
