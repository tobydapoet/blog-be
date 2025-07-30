import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FollowingDto {
  @IsInt()
  @ApiProperty()
  clientId: number;

  @IsInt()
  @ApiProperty()
  followedId: number;
}
