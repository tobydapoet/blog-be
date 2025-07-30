import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  @ApiProperty()
  blogId: number;

  @IsString()
  @ApiProperty()
  categoryId: number;
}
