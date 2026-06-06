import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Socket }
from 'socket.io';

@WebSocketGateway({
  cors: true,
})

export class TrackingGateway {
  @SubscribeMessage(
    'vendorLocation',
  )

  handleLocation(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    payload: any,
  ) {
    client.broadcast.emit(
      'trackOrder',
      payload,
    );

    return {
      success: true,
    };
  }
}