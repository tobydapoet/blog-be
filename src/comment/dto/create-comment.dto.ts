import { IsEnum, IsInt, IsString } from 'class-validator';
import { CommentTableType } from '../types/commentTableType';

export class CreateCommentDto {
  @IsInt()
  commentTableId: number;

  @IsEnum(CommentTableType)
  commentTableType: CommentTableType;

  @IsInt()
  clientId: number;

  @IsString()
  content: string;
}
