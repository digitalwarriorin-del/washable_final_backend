import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectModel,
} from '@nestjs/mongoose';

import {
  Model,
} from 'mongoose';

import {
  Cart,
} from '../../database/schemas/cart.schema';

import {
  AddCartItemDto,
} from './dto/add-cart-item.dto';

@Injectable()

export class CartService {

  constructor(

    @InjectModel(Cart.name)
    private cartModel:
      Model<Cart>,
  ) {}

  private calculateTotals(
    cart: Cart,
  ) {

    cart.subtotal =
      cart.items.reduce(
        (
          total,
          item,
        ) =>
            total +
            (Number(item.price) || 0) * (Number(item.quantity) || 0),

        0,
      );

    cart.gst =
      cart.subtotal * 0.05;

    cart.totalAmount =
      cart.subtotal +
      cart.gst +
      cart.deliveryFee;
  }

  async addToCart(
    userId: string,
    dto: AddCartItemDto,
  ) {

    let cart =
      await this.cartModel.findOne({
        userId,
      });

    if (!cart) {

      cart =
        await this.cartModel.create({
          userId,
          items: [],
        });
    }

   const existingItem = cart.items.find(
  (item) =>
    item.serviceId === dto.serviceId &&
    item.vendorId === dto.vendorId &&
    item.pricingTitle === dto.pricingTitle
);

    if (existingItem) {

      existingItem.quantity +=
          dto.quantity;

    } else {

cart.items.push({
  serviceId: dto.serviceId,
  vendorId: dto.vendorId,
  serviceName: dto.serviceName,
  pricingTitle: dto.pricingTitle,
  quantity: dto.quantity,
  price: dto.price,
  image: dto.image ?? '',
});    }

    this.calculateTotals(cart);

    await cart.save();

    return {
      success: true,
      message:
          'Item added to cart',
      data: cart,
    };
  }

  async getCart(
    userId: string,
  ) {

    let cart =
      await this.cartModel.findOne({
        userId,
      });

    if (!cart) {

      cart =
        await this.cartModel.create({
          userId,
          items: [],
        });
    }

    this.calculateTotals(cart);

    await cart.save();

    return {
      success: true,
      data: cart,
    };
  }

  async updateQuantity(
 userId: string,
  serviceId: string,
  vendorId: string,
  pricingTitle: string,
  quantity: number,
  ) {

    const cart =
      await this.cartModel.findOne({
        userId,
      });

    if (!cart) {

      throw new NotFoundException(
        'Cart not found',
      );
    }

  const item = cart.items.find(
  (item) =>
    item.serviceId === serviceId &&
    item.vendorId === vendorId &&
    item.pricingTitle === pricingTitle
);

    if (!item) {

      throw new NotFoundException(
        'Item not found',
      );
    }

    item.quantity =
      quantity;

    this.calculateTotals(cart);

    await cart.save();

    return {
      success: true,
      data: cart,
    };
  }

  async removeItem(
    userId: string,
  serviceId: string,
  vendorId: string,
  pricingTitle: string,
  ) {

    const cart =
      await this.cartModel.findOne({
        userId,
      });

    if (!cart) {

      throw new NotFoundException(
        'Cart not found',
      );
    }

   cart.items = cart.items.filter(
  (item) =>
    !(
      item.serviceId === serviceId &&
      item.vendorId === vendorId &&
      item.pricingTitle === pricingTitle
    )
);

    this.calculateTotals(cart);

    await cart.save();

    return {
      success: true,
      message:
          'Item removed',
      data: cart,
    };
  }

  async clearCart(
    userId: string,
  ) {

    const cart =
      await this.cartModel.findOne({
        userId,
      });

    if (!cart) {

      throw new NotFoundException(
        'Cart not found',
      );
    }

    cart.items = [];

    this.calculateTotals(cart);

    await cart.save();

    return {
      success: true,
      message:
          'Cart cleared',
    };
  }
}