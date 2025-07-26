import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { Following } from './entities/following.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Following])],
  controllers: [FollowingController],
  providers: [FollowingService],
})
export class FollowingModule {}
