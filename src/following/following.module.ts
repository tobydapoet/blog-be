import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { Following } from './entities/following.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Following]), NotificationModule],
  controllers: [FollowingController],
  providers: [FollowingService],
  exports: [FollowingService],
})
export class FollowingModule {}
