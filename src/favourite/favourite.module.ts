import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite, Comment, Blog, Post])],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
