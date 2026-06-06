import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  handleConnection(client) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('order_update')
  handleOrderUpdate(@MessageBody() data: any) {
    return {
      event: 'order_update',
      data,
    };
  }
}