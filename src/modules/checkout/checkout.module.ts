import { Module }
from '@nestjs/common';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  Checkout,
  CheckoutSchema,
} from '../../database/schemas/checkout.schema';

import {
  Cart,
  CartSchema,
} from '../../database/schemas/cart.schema';

import {
  CheckoutController,
} from './checkout.controller';

import {
  CheckoutService,
} from './checkout.service';

@Module({
  imports: [

    MongooseModule.forFeature([
      {
        name: Checkout.name,
        schema: CheckoutSchema,
      },

      {
        name: Cart.name,
        schema: CartSchema,
      },
    ]),
  ],

  controllers: [
    CheckoutController,
  ],

  providers: [
    CheckoutService,
  ],

  exports: [
    CheckoutService,
  ],
})

export class CheckoutModule {}