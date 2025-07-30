import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notificationService.findOne(id);
  }

  @Get('client/:id')
  findByClient(@Param('id') id: number) {
    return this.notificationService.findByClient(id);
  }

  @Put('inactive/:id')
  inactive(@Param('id') id: number) {
    return this.notificationService.inactive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
