import { Module } from '@nestjs/common';
import { BlogCategoryService } from './blog_category.service';
import { BlogCategoryController } from './blog_category.controller';
import { BlogCategory } from './entities/blog_category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
})
export class BlogCategoryModule {}
