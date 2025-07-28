import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadCloundiaryModule } from 'src/upload_cloundiary/upload_cloundiary.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UploadCloundiaryModule,
    ClientModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
