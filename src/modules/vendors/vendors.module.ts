import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

import { Vendor, VendorSchema } from '../../database/schemas/vendor.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

import {
  User,
  UserSchema,
} from '../../database/schemas/user.schema';

@Module({
  imports: [
MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Vendor.name,
    schema: VendorSchema,
  },
  {
    name: Order.name,
    schema: OrderSchema,
  },
])
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}