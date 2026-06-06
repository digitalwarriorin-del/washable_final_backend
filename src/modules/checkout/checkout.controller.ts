import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from '../../common/guards/jwt-auth.guard';

import {
  CheckoutService,
} from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';



@Controller({
  path: 'checkout',
  version: '1',
})

export class CheckoutController {

  constructor(
    private readonly checkoutService:
      CheckoutService,
  ) {}

  @UseGuards(JwtAuthGuard)

  @Post()

  async createCheckout(
    @Req() req: any,

    @Body()
    dto: CreateCheckoutDto,
  ) {

    return this.checkoutService
      .createCheckout(
        req.user.userId,
        dto,
      );
  }
}