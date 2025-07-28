import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  receiver: string;

  @IsString()
  sender: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
