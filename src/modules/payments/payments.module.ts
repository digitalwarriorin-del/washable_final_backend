import { Module } from '@nestjs/common';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  PaymentsController,
} from './payments.controller';

import {
  PaymentsService,
} from './payments.service';

import {
  Checkout,
  CheckoutSchema,
} from '../../database/schemas/checkout.schema';


import {
  Cart,
  CartSchema,
} from '../../database/schemas/cart.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({

  imports: [

    MongooseModule.forFeature([

      {
        name: Checkout.name,
        schema: CheckoutSchema,
      },

      {
        name: Order.name,
        schema: OrderSchema,
      },

      {
        name: Cart.name,
        schema: CartSchema,
      },

    ]),
  ],

  controllers: [
    PaymentsController,
  ],

  providers: [
    PaymentsService,
  ],

})

export class PaymentsModule {}