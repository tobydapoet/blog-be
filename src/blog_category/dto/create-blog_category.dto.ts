import { IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  blogId: number;

  @IsString()
  categoryId: number;
}
