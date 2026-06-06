import {
  Injectable,
} from '@nestjs/common';

import {
  InjectModel,
} from '@nestjs/mongoose';

import {
  Model,
} from 'mongoose';

import {
  Service,
} from '../../database/schemas/service.schema';

import {
  CreateServiceDto,
} from './dto/create-service.dto';

import { Vendor } from '../../database/schemas/vendor.schema';
import { NotFoundException } from '@nestjs/common';
@Injectable()

export class ServicesService {

constructor(
  @InjectModel(Service.name)
  private serviceModel: Model<Service>,

  @InjectModel(Vendor.name)
  private vendorModel: Model<Vendor>,
) {}

async createService(
  userId: string,
  body: any,
) {
  const vendor = await this.vendorModel.findOne({
    userId,
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  return this.serviceModel.create({
    vendorId: vendor._id.toString(),

    name: body.name,
    description: body.description,
    category: body.category,
    pricing: body.pricing,
    icon: body.icon,
    isActive: true,

    location: {
      type: 'Point',
      coordinates: [
        body.location.longitude,
        body.location.latitude,
      ],
    },

    serviceRadiusKm:
      body.serviceRadiusKm ?? 5,
  });
}
  async getVendorServices(
  vendorId: string,
) {

  const services =
    await this.serviceModel.find({
      vendorId,
    });

  return {
    success: true,
    data: services,
  };
}

async findNearbyServices(
  latitude: number,
  longitude: number,
  radiusKm: number = 5,
) {
  return this.serviceModel.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude], // IMPORTANT ORDER
        },
        $maxDistance: radiusKm * 1000, // km → meters
      },
    },
    isActive: true,
  });
}
}