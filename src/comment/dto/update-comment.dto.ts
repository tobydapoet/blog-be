import { Optional } from '@nestjs/common';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class UpdateCommentDto {
  @Optional()
  @IsString()
  content?: string;

  @Optional()
  @IsBoolean()
  isDeleted?: boolean;
}
