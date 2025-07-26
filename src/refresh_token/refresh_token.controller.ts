import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RefreshTokenService } from './refresh_token.service';
import { CreateRefreshTokenDto } from './dto/create-refresh_token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh_token.dto';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  create(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.refreshTokenService.create(createRefreshTokenDto);
  }

  @Get()
  findAll() {
    return this.refreshTokenService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  ) {
    return this.refreshTokenService.update(+id, updateRefreshTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refreshTokenService.remove(+id);
  }
}
