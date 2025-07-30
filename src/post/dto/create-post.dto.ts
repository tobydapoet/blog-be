import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreatePostDto {
  @Type(() => Number)
  @IsInt()
  @ApiProperty()
  clientId: number;

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
