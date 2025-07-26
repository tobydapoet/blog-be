import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCloundiaryService } from './upload_cloundiary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('upload')
export class UploadCloundiaryController {
  constructor(private readonly uploadService: UploadCloundiaryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    try {
      const result = await this.uploadService.uploadImage(file.buffer, folder);
      console.log('Received file:', file);
      return result.url;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to upload image');
    }
  }
}
