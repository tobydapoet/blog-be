import { IsEnum, IsInt } from 'class-validator';
import { FavouriteTableType } from '../types/favouriteTableType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteDto {
  @IsInt()
  @ApiProperty()
  favouriteTableId: number;

  @IsEnum(FavouriteTableType)
  @ApiProperty()
  favouriteTableType: FavouriteTableType;

  @IsInt()
  @ApiProperty()
  clientId: number;
}
