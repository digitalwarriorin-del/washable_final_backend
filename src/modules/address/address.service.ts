import {
  Injectable,
} from '@nestjs/common';

import {
  InjectModel,
} from '@nestjs/mongoose';

import { Model }
from 'mongoose';

import {
  Address,
} from '../../database/schemas/address.schema';

import {
  CreateAddressDto,
} from './dto/create-address.dto';

@Injectable()

export class AddressService {

  constructor(

    @InjectModel(Address.name)
    private addressModel:
      Model<Address>,
  ) {}

  async createAddress(
    userId: string,
    dto: CreateAddressDto,
  ) {

    if (dto.isDefault) {

      await this.addressModel.updateMany(
        {
          userId,
        },
        {
          isDefault: false,
        },
      );
    }

    const address =
      await this.addressModel.create({
        ...dto,
        userId,
      });

    return {
      success: true,
      message:
        'Address created successfully',
      data: address,
    };
  }

  async getAddresses(
    userId: string,
  ) {

    const addresses =
      await this.addressModel.find({
        userId,
      });

    return {
      success: true,
      data: addresses,
    };
  }

  async deleteAddress(
    addressId: string,
    userId: string,
  ) {

    await this.addressModel.deleteOne({
      _id: addressId,
      userId,
    });

    return {
      success: true,
      message:
        'Address deleted successfully',
    };
  }
}