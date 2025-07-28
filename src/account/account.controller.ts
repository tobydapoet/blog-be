import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Post('register')
  async create(@Body() createAccountDto: CreateAccountDto) {
    try {
      const res = await this.accountService.create(createAccountDto);
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

  @Public()
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.accountService.findByEmail(email);
  }

  @Public()
  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':keyword')
  findMany(@Query('keyword') keyword: string) {
    return this.accountService.findMany(keyword);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body()
    updateAccountDto: Partial<UpdateAccountDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const res = await this.accountService.update(id, updateAccountDto, file);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message,
      };
    }
  }

  @Put(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.accountService.remove(id);
      return {
        success: false,
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
