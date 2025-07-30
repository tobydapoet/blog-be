import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar_url?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  google_id?: string;

  @IsString()
  @ApiProperty()
  name: string;
}
