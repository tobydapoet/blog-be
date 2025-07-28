import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
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
  @IsString()
  website_link?: string;

  @IsOptional()
  @IsDate()
  birth?: Date;

  @IsString()
  accountId: string;
}
