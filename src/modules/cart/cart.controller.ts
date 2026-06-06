import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from '../../common/guards/jwt-auth.guard';

import {
  CartService,
} from './cart.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller({
  path: 'cart',
  version: '1',
})
@UseGuards(
  JwtAuthGuard,
)
export class CartController {

  constructor(
    private readonly cartService: CartService,
  ) {}

  // ADD ITEM TO CART
  @Post()
  async addToCart(
    @Req() req,
    @Body() body,
  ) {
    return this.cartService.addToCart(
      req.user.userId,
      body,
    );
  }

  // GET USER CART
  @Get()
  async getCart(
    @Req() req,
  ) {
    return this.cartService.getCart(
      req.user.userId,
    );
  }

  // UPDATE QUANTITY
@Patch()
async updateQuantity(
  @Req() req,
  @Body() body: UpdateCartItemDto,
) {
  return this.cartService.updateQuantity(
    req.user.userId,
    body.serviceId,
    body.vendorId,
    body.pricingTitle,
    body.quantity,
  );
}

@Delete()
async removeItem(
  @Req() req,
  @Body() body: UpdateCartItemDto,
) {
  return this.cartService.removeItem(
    req.user.userId,
    body.serviceId,
    body.vendorId,
    body.pricingTitle,
  );
}

  // CLEAR ENTIRE CART
  @Delete('clear')
  async clearCart(
    @Req() req,
  ) {
    return this.cartService.clearCart(
      req.user.userId,
    );
  }
}