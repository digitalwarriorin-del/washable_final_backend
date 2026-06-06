import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NotificationModule } from '../notifications/notification.module';
import {
  Order,
  OrderSchema,
} from './schemas/order.schema';



import {
  Vendor,
  VendorSchema,
} from '../../database/schemas/vendor.schema';

import {
  Cart,
  CartSchema,
} from '../../database/schemas/cart.schema';

import {
  Checkout,
  CheckoutSchema,
} from '../../database/schemas/checkout.schema';

import { WalletModule } from '../wallet/wallet.module';
import { User, UserSchema } from '../../database/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Vendor.name,
        schema: VendorSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: Checkout.name,
        schema: CheckoutSchema,
      },
    ]),

    WalletModule,

    NotificationModule, // ✅ MOVE HERE (correct place)
  ],

  controllers: [OrdersController],

  providers: [OrdersService],

  exports: [OrdersService],
})
export class OrdersModule {}