import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

@WebSocketGateway({ cors: true })
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    let token =
      client.handshake.headers.authorization || client.handshake.query['token'];
    if (Array.isArray(token)) token = token[0];
    console.log(client.id);
    if (!token) {
      console.log('no found token!');
      client.disconnect();
      return;
    }
    token = token.replace('Bearer', '').trim();
    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (err) {
      client.disconnect();
    }
    const userId = client.handshake.query.userId;

    if (!userId) {
      client.disconnect(true);
      return;
    }
    console.log(userId);
    client.join(userId);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      console.log(`${userId} disconnected`);
    }
    client.disconnect();
  }

  @SubscribeMessage('chat')
  async handleSendMessage(
    @MessageBody() message: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const saved = await this.chatService.create(message);
      console.log('[WS] Nhận message:', message);
      this.server.to(message.sender).emit('sender_message', saved);
      this.server.to(message.receiver).emit('receive_message', saved);
    } catch (err) {
      client.emit('error_message: ', { error: err.message });
    }
  }
}
