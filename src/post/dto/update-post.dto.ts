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
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
