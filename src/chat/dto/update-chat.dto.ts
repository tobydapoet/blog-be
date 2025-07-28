import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
