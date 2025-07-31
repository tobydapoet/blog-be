import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCloundiaryService } from './upload_cloundiary.service';

@Controller('upload')
export class UploadCloundiaryController {
  constructor(private readonly uploadService: UploadCloundiaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    try {
      const result = await this.uploadService.uploadImage(file.buffer, folder);
      return result.url;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to upload image');
    }
  }

  @Delete()
  async deleteFile(@Query('url') url: string) {
    await this.uploadService.deleteImage(url);
    return { message: 'Image deleted' };
  }
}
