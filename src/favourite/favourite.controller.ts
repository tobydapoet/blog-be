import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Post()
  create(@Body() createFavouriteDto: CreateFavouriteDto) {
    try {
      const res = this.favouriteService.create(createFavouriteDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Get('/client/:id')
  findByClient(@Param('id') id: number) {
    return this.favouriteService.findByClient(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.favouriteService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.favouriteService.remove(id);
      return {
        success: true,
        message: 'Delete success!',
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
