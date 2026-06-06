import { Order } from '../orders/schemas/order.schema';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vendor } from '../../database/schemas/vendor.schema';
import { CreateVendorDto } from './dto/create-vendor.dto';

import { BadRequestException } from '@nestjs/common';
import { User } from '../../database/schemas/user.schema';
import { Role } from '../../common/enums/role.enum';
@Injectable()
export class VendorsService {
constructor(

  @InjectModel(User.name)
  private userModel: Model<User>,

  @InjectModel(Vendor.name)
  private vendorModel: Model<Vendor>,

  @InjectModel(Order.name)
  private orderModel: Model<Order>,

) {}

async createVendor(dto: CreateVendorDto) {

  const existingVendor =
    await this.vendorModel.findOne({
      mobile: dto.mobile,
    });

  if (existingVendor) {
    throw new BadRequestException(
      'Vendor already exists with this mobile number',
    );
  }

  let user =
    await this.userModel.findOne({
      mobile: dto.mobile,
    });

  if (!user) {

    user =
      await this.userModel.create({
        mobile: dto.mobile,
        role: Role.VENDOR,
      });
  }

  const vendor =
    await this.vendorModel.create({

      userId:
        user._id.toString(),

      ownerName:
        dto.ownerName,

      shopName:
        dto.shopName,

      mobile:
        dto.mobile,

      shopAddress:
        dto.shopAddress,

      location: {
        type: 'Point',
        coordinates: [
          dto.longitude,
          dto.latitude,
        ],
      },

      isActive:
        dto.isActive,
    });

  return {
    success: true,
    data: vendor,
  };
}
  // ✅ FIXED METHOD NAME (MATCH CONTROLLER)
async getVendorOrders(
  userId: string,
  status?: string,
) {
 const vendor = await this.vendorModel.findOne({
  userId: userId,
});

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  const query: any = {
    vendorId: vendor._id,
  };

  if (status) {
    query.status = status;
  }

  const orders = await this.orderModel
    .find(query)
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: orders.length,
    data: orders,
  };
}


  async findNearbyVendors(latitude: number, longitude: number) {
    const vendors = await this.vendorModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000,
        },
      },
    });

    return {
      success: true,
      data: vendors,
    };
  }

  async getAllVendors() {
    const vendors = await this.vendorModel.find();

    return {
      success: true,
      data: vendors,
    };
  }
}