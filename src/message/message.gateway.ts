import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  // Emit Message to receiver
  sendMessageToReceiver(receiverId: string, message: any) {
    this.server.to(receiverId).emit('newMessage', message);
  }

  // Join room based on user id
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(userId);
    console.log(`User ${userId} joined room`);
  }
}
