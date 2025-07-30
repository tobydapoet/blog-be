import { IsEnum, isEnum, IsInt, isInt, IsString } from 'class-validator';
import { NotificationType } from '../types/notification';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @IsInt()
  @ApiProperty()
  clientId: number;

  @IsEnum(NotificationType)
  @ApiProperty()
  type: NotificationType;

  @IsInt()
  @ApiProperty()
  refId: number;

  @IsString()
  @ApiProperty()
  message: string;
}
