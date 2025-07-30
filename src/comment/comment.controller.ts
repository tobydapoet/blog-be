import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentTableType } from './types/commentTableType';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      const res = this.commentService.create(createCommentDto);
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

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiBearerAuth()
  @Get('get_type')
  findByType(@Query('type') type: CommentTableType, @Query('id') id: number) {
    return this.commentService.findByType(id, type);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findOne(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    try {
      const res = this.commentService.update(id, updateCommentDto);
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
}
