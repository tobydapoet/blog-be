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
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles(Role.CLIENT)
  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @Public()
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @ApiBearerAuth()
  @Get('client/:id')
  findByClient(@Param('id') id: number) {
    return this.blogService.findByClient(id);
  }

  @ApiBearerAuth()
  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return await this.blogService.findByCategory(category);
  }

  @ApiBearerAuth()
  @Get('search')
  async findMany(@Query('keyword') keyword: string) {
    return await this.blogService.findMany(keyword);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.blogService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.CLIENT)
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

  @Roles(Role.ADMIN, Role.STAFF)
  @Put('status/:id')
  async updateStatus(@Param('id') id: number, @Body() status: number) {
    try {
      const res = await this.blogService.updateStatus(id, status);
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
