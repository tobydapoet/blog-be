import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private blogCategoryRepo: Repository<BlogCategory>,
  ) {}
  async create(createBlogCategoryDto: CreateBlogCategoryDto) {
    const exist = await this.blogCategoryRepo.findOne({
      where: {
        blog: { id: createBlogCategoryDto.blogId },
        category: { id: createBlogCategoryDto.categoryId },
      },
    });
    if (exist) {
      return new Error('This blog already in this category!');
    }
    const blogCategory = this.blogCategoryRepo.create({
      blog: { id: createBlogCategoryDto.blogId },
      category: { id: createBlogCategoryDto.categoryId },
    });

    return this.blogCategoryRepo.save(blogCategory);
  }

  async remove(blogId: number, categoryId: number) {
    const blogCategory = await this.blogCategoryRepo.findOne({
      where: {
        blog: { id: blogId },
        category: { id: categoryId },
      },
    });

    if (!blogCategory) {
      throw new NotFoundException('Blog category mapping not found.');
    }

    await this.blogCategoryRepo.remove(blogCategory);
  }
}
