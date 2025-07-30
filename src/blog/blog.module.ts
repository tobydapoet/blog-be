import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UploadCloundiaryModule } from 'src/upload_cloundiary/upload_cloundiary.module';
import { RedisModule } from 'src/redis/redis.module';
import { CategoryModule } from 'src/category/category.module';
import { Following } from 'src/following/entities/following.entity';
import { FollowingModule } from 'src/following/following.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    CategoryModule,
    UploadCloundiaryModule,
    RedisModule,
    FollowingModule,
    NotificationModule,
    ClientModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
