import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
    Query,   // ✅ ADD THIS

} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '../../common/enums/order-status.enum';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  // ================= CUSTOMER =================

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Req() req,
    @Body() body: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(
      req.user.userId,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async myOrders(@Req() req) {
    return this.ordersService.getUserOrders(
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrder(
    @Param('id') id: string,
  ) {
    return this.ordersService.getOrderById(id);
  }

  // ================= VENDOR =================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
@Get('vendor/list')
async vendorOrders(
  @Req() req,
  @Query('status') status?: string,
) {
  return this.ordersService.getVendorOrders(
    req.user.userId,
    status,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.VENDOR)
@Get('vendor/dashboard')
async dashboard(
  @Req() req,
) {
  return this.ordersService.getVendorDashboard(
    req.user.userId,
  );
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @Patch(':id/accept')
  async acceptOrder(
    @Param('id') orderId: string,
  ) {
    return this.ordersService.updateStatus(
      orderId,
      OrderStatus.ACCEPTED,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @Patch(':id/reject')
  async rejectOrder(
    @Param('id') orderId: string,
  ) {
    return this.ordersService.updateStatus(
      orderId,
      OrderStatus.REJECTED,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @Patch(':id/status')
  async updateVendorStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(
      orderId,
      status,
    );
  }

  // ================= ADMIN =================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}