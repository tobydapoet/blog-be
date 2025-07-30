import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { StaffModule } from './staff/staff.module';
import { CategoryModule } from './category/category.module';
import { BlogCategoryModule } from './blog_category/blog_category.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { FavouriteModule } from './favourite/favourite.module';
import { FollowingModule } from './following/following.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh_token/refresh_token.module';
import { UploadCloundiaryModule } from './upload_cloundiary/upload_cloundiary.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    ClientModule,
    StaffModule,
    CategoryModule,
    BlogCategoryModule,
    BlogModule,
    CommentModule,
    FavouriteModule,
    FollowingModule,
    PostModule,
    ChatModule,
    NotificationModule,
    AuthModule,
    RefreshTokenModule,
    UploadCloundiaryModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
