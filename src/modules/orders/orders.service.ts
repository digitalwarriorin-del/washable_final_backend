import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

import { Vendor } from '../../database/schemas/vendor.schema';
import { Cart } from '../../database/schemas/cart.schema';
import { Checkout } from '../../database/schemas/checkout.schema';

import { WalletService } from '../wallet/wallet.service';

import { OrderDocument } from './schemas/order.schema';

import { NotificationService } from '../notifications/notification.service';
import { User } from '../../database/schemas/user.schema';
const orders: OrderDocument[] = [];

@Injectable()
export class OrdersService {
constructor(
  @InjectModel(Order.name)
  private orderModel: Model<Order>,

  @InjectModel(Vendor.name)
  private vendorModel: Model<Vendor>,

  @InjectModel(User.name)
  private userModel: Model<User>,   // ✅ ADD THIS

  @InjectModel(Cart.name)
  private cartModel: Model<Cart>,

  @InjectModel(Checkout.name)
  private checkoutModel: Model<Checkout>,

  private readonly walletService: WalletService,

  private readonly notificationService: NotificationService, // ✅ ADD THIS
) {}

  async getAllOrders() {
    const orders = await this.orderModel
      .find()
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: orders,
    };
  }

async createOrder(userId: string, body: CreateOrderDto) {

  const checkout = await this.checkoutModel.findById(body.checkoutId);
  if (!checkout) throw new NotFoundException('Checkout not found');

  const cart = await this.cartModel.findById(body.cartId);
  if (!cart) throw new NotFoundException('Cart not found');

  if (!cart.items?.length) {
    throw new Error('Cart is empty');
  }

  // 💳 WALLET PAYMENT
  if (body.paymentMethod === 'WALLET') {
    const wallet = await this.walletService.getWallet(userId);

    if (!wallet?.data || wallet.data.balance < checkout.totalAmount) {
      throw new Error('Insufficient wallet balance');
    }

    await this.walletService.debitWallet({
      userId,
      amount: checkout.totalAmount,
      note: 'Order payment',
    });
  }

  const selectedIds = body.selectedServiceIds ?? [];

  const selectedItems = selectedIds.length
    ? cart.items.filter(i => selectedIds.includes(i.serviceId))
    : cart.items;

  // 🔥 GROUP ITEMS BY VENDOR
  const grouped: Record<string, any[]> = {};

  for (const item of selectedItems) {
    if (!item.vendorId) continue;

    if (!grouped[item.vendorId]) {
      grouped[item.vendorId] = [];
    }

    grouped[item.vendorId].push(item);
  }

  const createdOrders: OrderDocument[] = [];

  for (const vendorId of Object.keys(grouped)) {

    const items = grouped[vendorId];

    const vendor = await this.vendorModel.findById(vendorId);
    const vendorUserId = vendor?.userId;

    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * (i.quantity || 1),
      0,
    );

    // 🧾 CREATE ORDER
    const order = await this.orderModel.create({
      userId,
      vendorId,
      vendorUserId,
      items,
      totalAmount,
      addressId: body.addressId,
      checkoutId: body.checkoutId,
      cartId: body.cartId,
      paymentId: body.paymentId,
      paymentStatus: body.paymentMethod === 'WALLET' ? 'PAID' : 'PENDING',
      status: OrderStatus.PLACED,
    });

    // 🔔 NOTIFY VENDOR (IMPORTANT FIX)
    if (vendor?.fcmToken) {
      await this.notificationService.sendToToken(
        vendor.fcmToken,
        'New Order Received 🧺',
        'You have received a new laundry order',
        {
          orderId: order._id.toString(),
          vendorId: vendorId,
        },
      );
    }

    createdOrders.push(order);
  }

  // 🧹 REMOVE SELECTED ITEMS FROM CART
  await this.cartModel.findByIdAndUpdate(body.cartId, {
    $pull: {
      items: {
        serviceId: { $in: selectedIds },
      },
    },
  });

  return {
    success: true,
    data: createdOrders,
  };
}
 async getUserOrders(
  userId: string,
) {

  const orders =
    await this.orderModel
      .find({
        userId,
      })
      .sort({
        createdAt: -1,
      });

  return {
    success: true,
    data: orders,
  };
}

async getVendorOrders(  vendorUserId: string, status?: string) {

  const query: any = {
    vendorUserId,
  };
  if (status) query.status = status;

  const orders = await this.orderModel.find(query);

  return {
    success: true,
    count: orders.length,
    data: orders,
  };
}
  async getOrderById(id: string) {
    const order =
      await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return {
      success: true,
      data: order,
    };
  }

async getVendorDashboard(vendorUserId: string) {

  const orders = await this.orderModel.find({
    vendorUserId,
  });
  return {
    success: true,
    data: {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'PLACED').length,
      acceptedOrders: orders.filter(o => o.status === 'ACCEPTED').length,
      inProgressOrders: orders.filter(o =>
        ['WASHING', 'IRONING', 'PICKED_UP'].includes(o.status)
      ).length,
      completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
      totalRevenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
      recentOrders: orders.slice(0, 5),
    },
  };
}
async updateStatus(
  orderId: string,
  status: OrderStatus,
) {
  const order = await this.orderModel.findById(orderId);

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  order.status = status;
  await order.save();

  // fetch user for notification
  const user = await this.userModel.findById(order.userId);

  if (user?.fcmToken) {
    await this.notificationService.sendToToken(
      user.fcmToken,
      'Order Update 📦',
      `Your order is now ${status}`,
      { orderId },
    );
  }

  return {
    success: true,
    data: order,
  };
}
async cancelOrder(
  userId: string,
  orderId: string,
) {

  const order =
    await this.orderModel.findById(
      orderId,
    );

  if (!order) {

    throw new NotFoundException(
      'Order not found',
    );
  }

  if (
    order.userId !== userId
  ) {

    throw new NotFoundException(
      'Order not found',
    );
  }

  if (
    order.status ===
    OrderStatus.CANCELLED
  ) {

    throw new Error(
      'Order already cancelled',
    );
  }

  if (
    order.status ===
    OrderStatus.DELIVERED
  ) {

    throw new Error(
      'Delivered order cannot be cancelled',
    );
  }

  order.status =
    OrderStatus.CANCELLED;

  await order.save();

  await this.walletService
    .refundOrder({

      userId:
        order.userId,

      orderId:
        order._id.toString(),

      amount:
        order.totalAmount,
    });

  return {

    success: true,

    message:
      'Order cancelled and refunded',
  };
}
}