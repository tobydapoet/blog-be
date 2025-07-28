import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UploadCloundiaryModule } from 'src/upload_cloundiary/upload_cloundiary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UploadCloundiaryModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
