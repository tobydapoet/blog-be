import { Controller, Post, Body, Delete, Query } from '@nestjs/common';
import { BlogCategoryService } from './blog_category.service';
import { CreateBlogCategoryDto } from './dto/create-blog_category.dto';

@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  async create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    try {
      const res = await this.blogCategoryService.create(createBlogCategoryDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  @Delete()
  async remove(
    @Query('blog') blogId: number,
    @Query('category') categoryId: number,
  ) {
    try {
      await this.blogCategoryService.remove(blogId, categoryId);
      return {
        success: true,
        message: 'Delete success!',
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
}
