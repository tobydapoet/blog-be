import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, Blog]),
    NotificationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
