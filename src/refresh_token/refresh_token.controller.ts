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
}
