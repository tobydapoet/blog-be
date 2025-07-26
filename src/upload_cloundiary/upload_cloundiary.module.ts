import { Module } from '@nestjs/common';
import { UploadCloundiaryService } from './upload_cloundiary.service';
import { UploadCloundiaryController } from './upload_cloundiary.controller';

@Module({
  providers: [UploadCloundiaryService],
  controllers: [UploadCloundiaryController]
})
export class UploadCloundiaryModule {}
