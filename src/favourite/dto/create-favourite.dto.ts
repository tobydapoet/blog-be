import { IsEnum, IsInt } from 'class-validator';
import { FavouriteTableType } from '../types/favouriteTableType';

export class CreateFavouriteDto {
  @IsInt()
  favouriteTableId: number;

  @IsEnum(FavouriteTableType)
  favouriteTableType: FavouriteTableType;

  @IsInt()
  clientId: number;
}
