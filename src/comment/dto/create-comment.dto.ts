import { IsEnum, IsInt, IsString } from 'class-validator';
import { CommentTableType } from '../types/commentTableType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsInt()
  @ApiProperty()
  commentTableId: number;

  @IsEnum(CommentTableType)
  @ApiProperty()
  commentTableType: CommentTableType;

  @IsInt()
  @ApiProperty()
  clientId: number;

  @IsString()
  @ApiProperty()
  content: string;
}
