import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingDto } from './dto/following.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Post()
  async create(@Body() followingDto: FollowingDto) {
    try {
      const res = await this.followingService.create(followingDto);
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

  @Get('client/:id')
  findByFollower(@Param('id') id: number) {
    return this.followingService.findByFollower(id);
  }

  @Get('followed/:id')
  findOne(@Param('id') id: number) {
    return this.followingService.findByFollowed(id);
  }

  @Delete()
  async remove(@Body() followingDto: FollowingDto) {
    try {
      await this.followingService.remove(followingDto);
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
