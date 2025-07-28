import { IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsOptional()
  @IsString()
  phone: string;

  @IsString()
  accountId: string;
}
