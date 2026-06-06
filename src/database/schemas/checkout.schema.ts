import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CheckoutDocument = HydratedDocument<Checkout>;

@Schema({ timestamps: true })
export class Checkout {

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  cartId!: string;

  @Prop({ required: true })
  addressId!: string;

  @Prop({ required: true })
  subtotal!: number;

  @Prop({ required: true })
  gst!: number; // ✅ FIXED (was missing required flag)

  @Prop({ required: true })
  deliveryFee!: number;

  @Prop({ required: true })
  platformFee!: number;

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({ default: 'PENDING' })
  paymentStatus!: string;

  @Prop()
  razorpayOrderId?: string;

  // ✅ ADD THIS (CRITICAL)
  @Prop({ type: [String], default: [] })
  selectedServiceIds!: string[];
}

export const CheckoutSchema =
  SchemaFactory.createForClass(Checkout);