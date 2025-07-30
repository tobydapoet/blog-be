import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @Roles(Role.CLIENT)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const res = await this.postService.create(createPostDto, files);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @ApiBearerAuth()
  @Get('search')
  findMany(@Query('keyword') keyword: string) {
    return this.postService.findMany(keyword);
  }

  @ApiBearerAuth()
  @Get('client/:id')
  findByClient(@Param('id') id: number) {
    return this.postService.findByClient(id);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseInterceptors(FileInterceptor('files'))
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const res = await this.postService.update(id, updatePostDto, files);
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
