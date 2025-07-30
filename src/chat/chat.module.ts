import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadCloundiaryModule } from 'src/upload_cloundiary/upload_cloundiary.module';
import { AccountModule } from 'src/account/account.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    UploadCloundiaryModule,
    AccountModule,
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
