import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class UpdateCommentDto {
  @Optional()
  @IsString()
  @ApiProperty()
  content?: string;

  @Optional()
  @IsBoolean()
  @ApiProperty()
  isDeleted?: boolean;
}
