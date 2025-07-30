import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar_url?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isDeleted?: boolean;
}
