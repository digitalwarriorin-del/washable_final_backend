import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class UpdateOrderStatusDto {

  @IsString()
  orderId!: string;

  @IsEnum(OrderStatus)
  status!: OrderStatus;
}