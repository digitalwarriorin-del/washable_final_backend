import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Req } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  // =========================
  // CREATE SERVICE
  // =========================
@Post()
@UseGuards(JwtAuthGuard)
async createService(
  @Req() req,
  @Body() body: any,
) {
  return this.servicesService.createService(
    req.user.userId,
    body,
  );
}

  // =========================
  // NEARBY SERVICES (GEO)
  // =========================
  @Get('nearby')
  async nearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.servicesService.findNearbyServices(
      Number(latitude),
      Number(longitude),
      Number(radiusKm ?? 5), // default 5km
    );
  }

  // =========================
  // GET SERVICES BY VENDOR
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('vendor/:vendorId')
  async getVendorServices(
    @Param('vendorId') vendorId: string,
  ) {
    return this.servicesService.getVendorServices(vendorId);
  }
}