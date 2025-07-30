import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Client } from 'src/client/entities/client.entity';
import { ClientModule } from 'src/client/client.module';
import { StaffModule } from 'src/staff/staff.module';
import { UploadCloundiaryModule } from 'src/upload_cloundiary/upload_cloundiary.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Client]),
    RedisModule,
    ClientModule,
    StaffModule,
    UploadCloundiaryModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
