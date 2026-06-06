import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from '../../common/guards/jwt-auth.guard';

import {
  AddressService,
} from './address.service';

import {
  CreateAddressDto,
} from './dto/create-address.dto';

@Controller({
  path: 'addresses',
  version: '1',
})

export class AddressController {

  constructor(
    private readonly addressService:
      AddressService,
  ) {}

  @UseGuards(JwtAuthGuard)

  @Post()

  async createAddress(
    @Req() req: any,

    @Body()
    dto: CreateAddressDto,
  ) {

    return this.addressService
      .createAddress(
        req.user.userId,
        dto,
      );
  }

  @UseGuards(JwtAuthGuard)

  @Get()

  async getAddresses(
    @Req() req: any,
  ) {

    return this.addressService
      .getAddresses(
        req.user.userId,
      );
  }

  @UseGuards(JwtAuthGuard)

  @Delete(':id')

  async deleteAddress(
    @Param('id')
    id: string,

    @Req() req: any,
  ) {

    return this.addressService
      .deleteAddress(
        id,
        req.user.userId,
      );
  }
}