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
  clientId: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
