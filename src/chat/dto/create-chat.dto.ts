import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @ApiProperty()
  receiver: string;

  @IsString()
  @ApiProperty()
  sender: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  images?: string[];
}
