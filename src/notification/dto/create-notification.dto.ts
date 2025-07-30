import { IsEnum, isEnum, IsInt, isInt, IsString } from 'class-validator';
import { NotificationType } from '../types/notification';

export class CreateNotificationDto {
  @IsInt()
  clientId: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsInt()
  refId: number;

  @IsString()
  message: string;
}
