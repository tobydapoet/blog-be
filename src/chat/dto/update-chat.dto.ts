import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  content?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isDeleted?: boolean;
}
