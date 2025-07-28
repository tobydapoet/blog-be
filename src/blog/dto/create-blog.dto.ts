import { IsInt, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsInt()
  clientId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  thumbnail: string;
}
