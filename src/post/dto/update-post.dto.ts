import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isDeleted?: boolean;
}
