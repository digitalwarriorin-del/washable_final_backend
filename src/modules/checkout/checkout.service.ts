import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectModel,
} from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Checkout,
} from '../../database/schemas/checkout.schema';

import {
  Cart,
} from '../../database/schemas/cart.schema';

import { CreateCheckoutDto } from './dto/create-checkout.dto';

import {
  razorpay,
} from '../../config/razorpay.config';

@Injectable()
export class CheckoutService {

  constructor(
    @InjectModel(Checkout.name)
    private checkoutModel: Model<Checkout>,

    @InjectModel(Cart.name)
    private cartModel: Model<Cart>,
  ) {}

  async createCheckout(userId: string, dto: CreateCheckoutDto) {

    const cart = await this.cartModel.findById(dto.cartId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // 🔥 STEP 1: FILTER ONLY SELECTED ITEMS (CRITICAL FIX)
    const selectedItems = cart.items.filter(item =>
      dto.selectedServiceIds.includes(item.serviceId),
    );

    if (selectedItems.length === 0) {
      throw new NotFoundException('No selected items found in cart');
    }

    // 🔥 STEP 2: SUBTOTAL FROM SELECTED ITEMS ONLY
    const subtotal = selectedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // 🔥 STEP 3: GST (MATCH FRONTEND OR REMOVE FROM FRONTEND LATER)
    const gst = subtotal * 0.18;

    // 🔥 STEP 4: DELIVERY (backend rule OR cart value)
    const deliveryFee = cart.deliveryFee ?? 40;

    // 🔥 STEP 5: PLATFORM FEE
    const platformFee = 10;

    // 🔥 STEP 6: FINAL TOTAL
    const totalAmount = subtotal + gst + deliveryFee + platformFee;

    // 🔥 STEP 7: RAZORPAY ORDER
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // 🔥 STEP 8: SAVE CHECKOUT
    const checkout = await this.checkoutModel.create({
      userId,
      cartId: dto.cartId,
      addressId: dto.addressId,
      subtotal,
      gst,
      deliveryFee,
      platformFee,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      selectedServiceIds: dto.selectedServiceIds,
    });

    return {
      success: true,
      data: {
        checkout,
        razorpayOrder,
      },
    };
  }
}