import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogCategoryService } from './blog_category.service';
import { CreateBlogCategoryDto } from './dto/create-blog_category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog_category.dto';

@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogCategoryService.create(createBlogCategoryDto);
  }

  @Get()
  findAll() {
    return this.blogCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogCategoryDto: UpdateBlogCategoryDto) {
    return this.blogCategoryService.update(+id, updateBlogCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogCategoryService.remove(+id);
  }
}
