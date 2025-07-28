import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  facebook_link?: string;

  @IsOptional()
  @IsString()
  instagram_link?: string;

  @IsOptional()
  @IsDate()
  birth: Date;

  @IsOptional()
  @IsString()
  website_link?: string;
}
