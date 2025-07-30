import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
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
  @IsString()
  @ApiProperty()
  website_link?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  birth?: Date;

  @IsString()
  @ApiProperty()
  accountId: string;
}
