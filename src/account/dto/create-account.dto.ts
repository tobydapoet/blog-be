import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsString()
  google_id?: string;

  @IsString()
  name: string;
}
