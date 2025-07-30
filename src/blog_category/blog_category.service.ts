import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog_category.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private blogCategoryRepo: Repository<BlogCategory>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
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

    const savedBlogCategory = await this.blogCategoryRepo.save(blogCategory);
    if (savedBlogCategory) {
      await this.redisClient.del(`blog:${createBlogCategoryDto.blogId}`);
      await this.redisClient.del(
        `category:${createBlogCategoryDto.categoryId}`,
      );
    }
    return savedBlogCategory;
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

    const removed = await this.blogCategoryRepo.remove(blogCategory);
    if (removed) {
      await this.redisClient.del(`blog:${blogId}`);
      await this.redisClient.del(`category:${categoryId}`);
    }
    return removed;
  }
}
