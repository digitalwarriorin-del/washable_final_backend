import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import crypto from 'crypto';

import {
  InjectModel,
} from '@nestjs/mongoose';

import { Model }
from 'mongoose';

import {
  Checkout,
} from '../../database/schemas/checkout.schema';


import {
  Cart,
} from '../../database/schemas/cart.schema';
import { Order, OrderStatus } from '../orders/schemas/order.schema';

@Injectable()

export class PaymentsService {

  constructor(

    @InjectModel(Checkout.name)
    private checkoutModel:
      Model<Checkout>,

    @InjectModel(Order.name)
    private orderModel:
      Model<Order>,

    @InjectModel(Cart.name)
    private cartModel:
      Model<Cart>,
  ) {}

  async verifyPayment(
    body: any,
  ) {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      checkoutId,

    } = body;

    const generatedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env
            .RAZORPAY_KEY_SECRET!,
        )
        .update(
          razorpay_order_id
          + '|'
          + razorpay_payment_id,
        )
        .digest('hex');

    if (
      generatedSignature
      !== razorpay_signature
    ) {

      throw new BadRequestException(
        'Invalid payment signature',
      );
    }

    const checkout =
      await this.checkoutModel.findById(
        checkoutId,
      );

    if (!checkout) {

      throw new BadRequestException(
        'Checkout not found',
      );
    }

    // CREATE ORDER
    const order =
      await this.orderModel.create({

        userId:
          checkout.userId,

vendorId: undefined,
        items: [],

        totalAmount:
          checkout.totalAmount,

        addressId:
          checkout.addressId,

        paymentId:
          razorpay_payment_id,

        paymentStatus:
          'PAID',
status:
  OrderStatus.PLACED,
      });

    // CLEAR CART
    await this.cartModel.findByIdAndDelete(
      checkout.cartId,
    );

    return {

      success: true,

      message:
        'Payment verified & order created',

      data: {
        order,
      },
    };
  }
}