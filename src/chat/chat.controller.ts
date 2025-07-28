import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('2users')
  async getChatBetweenTwoUsers(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ) {
    return this.chatService.getChatBetweenTwoUsers(user1, user2);
  }

  @Get('user/:id')
  async getAllConversations(@Param('id') id: string) {
    return this.chatService.getAllConversations(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('files'))
  create(
    @Body() createChatDto: CreateChatDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const res = this.chatService.create(createChatDto, files);
      return {
        success: true,
        res: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateChatDto: UpdateChatDto) {
    try {
      const res = this.chatService.update(id, updateChatDto);
      return {
        success: true,
        res: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
