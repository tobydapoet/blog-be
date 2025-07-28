import { IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  thumbnail: string;
}
