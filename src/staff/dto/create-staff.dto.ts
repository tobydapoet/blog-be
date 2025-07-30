import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  accountId: string;
}
