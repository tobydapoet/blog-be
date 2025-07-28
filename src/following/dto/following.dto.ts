import { IsInt } from 'class-validator';

export class FollowingDto {
  @IsInt()
  clientId: number;

  @IsInt()
  followedId: number;
}
