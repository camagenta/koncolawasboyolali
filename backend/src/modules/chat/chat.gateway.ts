import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.isActive) {
        client.disconnect();
        return;
      }
      client.data.user = user;
      client.join(`user:${user.id}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // cleanup handled automatically by socket.io
  }

  @SubscribeMessage('join:room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('leave:room')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  @SubscribeMessage('chat:send')
  async handleMessage(client: Socket, payload: { receiverId?: string; groupId?: string; message: string; messageType?: string; fileUrl?: string }) {
    const user = client.data.user;
    if (!user) return;

    const msg = await this.chatService.saveMessage({
      senderId: user.id,
      receiverId: payload.receiverId,
      groupId: payload.groupId,
      message: payload.message,
      messageType: payload.messageType,
      fileUrl: payload.fileUrl,
    });

    if (payload.groupId) {
      this.server.to(payload.groupId).emit('chat:message', msg);
      await this.prisma.discussionGroup.update({
        where: { id: payload.groupId },
        data: { lastActivityAt: new Date() },
      });
    } else if (payload.receiverId) {
      this.server.to(`user:${user.id}`).to(`user:${payload.receiverId}`).emit('chat:message', msg);
    }
  }

  @SubscribeMessage('chat:typing')
  handleTyping(client: Socket, payload: { roomId: string; isTyping: boolean }) {
    const user = client.data.user;
    if (!user) return;
    client.to(payload.roomId).emit('chat:typing', {
      userId: user.id,
      name: user.name,
      isTyping: payload.isTyping,
    });
  }
}
