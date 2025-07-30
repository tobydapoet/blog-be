import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadCloundiaryModule } from 'src/upload_cloundiary/upload_cloundiary.module';
import { ClientModule } from 'src/client/client.module';
import { RedisModule } from 'src/redis/redis.module';
import { NotificationModule } from 'src/notification/notification.module';
import { FollowingModule } from 'src/following/following.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    RedisModule,
    UploadCloundiaryModule,
    NotificationModule,
    ClientModule,
    FollowingModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
