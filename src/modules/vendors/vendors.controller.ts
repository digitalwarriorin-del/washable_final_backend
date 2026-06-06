import {
  Body,
  Controller,
  Get,
  Post,
  Query,
    Req,

} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller({
  path: 'vendors',
  version: '1',
})
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
  ) {}

  @Post()
  async createVendor(
    @Body() body: CreateVendorDto,
  ) {
    return this.vendorsService.createVendor(body);
  }

  @Get()
  async getAll() {
    return this.vendorsService.getAllVendors();
  }

  @Get('nearby')
  async nearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return this.vendorsService.findNearbyVendors(
      Number(latitude),
      Number(longitude),
    );
  }

@Get('orders')
@UseGuards(AuthGuard('jwt'))
async getVendorOrders(
  @Req() req: Request,
  @Query('status') status?: string,
) {
  
  return this.vendorsService.getVendorOrders(
    (req as any).user.userId,
    status,
  );
}
}