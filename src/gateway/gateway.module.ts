import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { ChatModule } from 'src/chat/chat.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({ imports: [ChatModule, AuthModule], providers: [Gateway] })
export class GatewayModule {}
