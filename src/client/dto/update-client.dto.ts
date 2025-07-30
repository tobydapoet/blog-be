import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  facebook_link?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  instagram_link?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  birth: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  website_link?: string;
}
