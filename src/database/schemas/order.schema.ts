// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

// export type OrderDocument = HydratedDocument<Order>;

// export enum OrderStatus {
//   PLACED = 'PLACED',
//   CONFIRMED = 'CONFIRMED',
//   PICKED_UP = 'PICKED_UP',
//   WASHING = 'WASHING',
//   IRONING = 'IRONING',
//   OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
//   DELIVERED = 'DELIVERED',
//   CANCELLED = 'CANCELLED',
// }

// @Schema({ timestamps: true })
// export class Order {

//   @Prop({ required: true })
//   userId!: string;

//   @Prop({ type: String, required: false })
//   vendorId?: string;

//   @Prop({ type: Array, default: [] })
//   items!: any[];

//   @Prop({ required: true })
//   totalAmount!: number;

//   @Prop({ required: true })
//   addressId!: string;

//   @Prop({ required: true })
//   checkoutId!: string;

//   @Prop({ required: true })
//   cartId!: string;

//   @Prop({ required: true })
//   paymentId!: string;

//   @Prop({ default: 'PAID' })
//   paymentStatus!: string;

//   @Prop({
//     enum: OrderStatus,
//     default: OrderStatus.PLACED,
//   })
//   status!: OrderStatus;
// }

// export const OrderSchema = SchemaFactory.createForClass(Order);