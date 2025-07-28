import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const res = this.blogService.create(createBlogDto, file);
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

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get('client/:id')
  findByClient(@Param('id') id: number) {
    return this.blogService.findByClient(id);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return await this.blogService.findByCategory(category);
  }

  @Get('search')
  async findMany(@Query('keyword') keyword: string) {
    return await this.blogService.findMany(keyword);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const res = await this.blogService.update(id, updateBlogDto, file);
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
}
