import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
} from 'mongoose';

export type CartDocument =
  HydratedDocument<Cart>;

// CART ITEM TYPE

export class CartItem {

  @Prop({
    required: true,
  })
  serviceId!: string;

  // IMPORTANT
  // REQUIRED FOR ORDERS + VENDOR DASHBOARD

  @Prop({
    required: true,
  })
  vendorId!: string;

  @Prop({
    required: true,
  })
  serviceName!: string;

  @Prop({
    required: true,
  })
  pricingTitle!: string;

  @Prop({
    required: true,
    default: 1,
  })
  quantity!: number;

  @Prop({
    required: true,
    default: 0,
  })
  price!: number;

  @Prop({
    default: '',
  })
  image?: string;
}

@Schema({
  timestamps: true,
})

export class Cart {

  @Prop({
    required: true,
  })
  userId!: string;

  @Prop({
    type: [
      {
        serviceId: {
          type: String,
          required: true,
        },

        vendorId: {
          type: String,
          required: true,
        },

        serviceName: {
          type: String,
          required: true,
        },

        pricingTitle: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: {
          type: Number,
          default: 0,
        },

        image: {
          type: String,
          default: '',
        },
      },
    ],

    default: [],
  })

  items!: CartItem[];

  @Prop({
    default: 0,
  })
  subtotal!: number;

  @Prop({
    default: 49,
  })
  deliveryFee!: number;

  @Prop({
    default: 0,
  })
  gst!: number;

  @Prop({
    default: 0,
  })
  totalAmount!: number;
}

export const CartSchema =
  SchemaFactory.createForClass(
    Cart,
  );