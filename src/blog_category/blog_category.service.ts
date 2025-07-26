import { Injectable } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog_category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog_category.dto';

@Injectable()
export class BlogCategoryService {
  create(createBlogCategoryDto: CreateBlogCategoryDto) {
    return 'This action adds a new blogCategory';
  }

  findAll() {
    return `This action returns all blogCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogCategory`;
  }

  update(id: number, updateBlogCategoryDto: UpdateBlogCategoryDto) {
    return `This action updates a #${id} blogCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogCategory`;
  }
}
