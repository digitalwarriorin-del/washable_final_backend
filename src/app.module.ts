import { Module } from '@nestjs/common';
import { WalletModule }
from './modules/wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './modules/services/services.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CartModule }
from './modules/cart/cart.module';
import { AddressModule }
from './modules/address/address.module';
import { CheckoutModule }
from './modules/checkout/checkout.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGO_URI ?? '',
    ),

    AuthModule,
    UsersModule,
    VendorsModule,
    OrdersModule,
    PaymentsModule,
    ServicesModule,
    WalletModule,
    CartModule,
    AddressModule,
    CheckoutModule,
    CartModule,
  ],
})

export class AppModule {}