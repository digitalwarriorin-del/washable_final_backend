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
  Wallet,
} from '../../database/schemas/wallet.schema';

import {
  WalletTransaction,
  WalletTransactionType,
} from '../../database/schemas/wallet-transaction.schema';

@Injectable()
export class WalletService {

  constructor(

    @InjectModel(Wallet.name)
    private walletModel:
    Model<Wallet>,

    @InjectModel(
      WalletTransaction.name,
    )
    private transactionModel:
    Model<WalletTransaction>,
  ) {}

 async getWallet(userId: string) {
  let wallet = await this.walletModel.findOne({
    userId,
  });

  if (!wallet) {
    wallet = await this.walletModel.create({
      userId,
      balance: 0,
    });
  }

  const transactions =
    await this.transactionModel.find({
      userId,
    });

  const totalEarned = transactions
    .filter(
      (t) =>
        t.type === WalletTransactionType.CREDIT ||
        t.type === WalletTransactionType.CASHBACK ||
        t.type === WalletTransactionType.REFUND,
    )
    .reduce(
      (sum, t) => sum + t.amount,
      0,
    );

  const totalWithdrawal = transactions
    .filter(
      (t) =>
        t.type === WalletTransactionType.DEBIT,
    )
    .reduce(
      (sum, t) => sum + t.amount,
      0,
    );

  return {
    success: true,
    data: {
      _id: wallet._id,
      userId: wallet.userId,
      balance: wallet.balance,
      totalEarned,
      totalWithdrawal,
    },
  };
}

  async createRechargeOrder(
  userId: string,
  amount: number,
) {
const { razorpay } =
require('../../config/razorpay.config');
  const order =
  await razorpay.orders.create({

    amount:
    Math.round(amount * 100),

    currency: 'INR',

    receipt:
    `wallet_${Date.now()}`,
  });

  return {

    success: true,

    data: order,
  };
}

async verifyRecharge({

  userId,

  amount,

  paymentId,
}: {

  userId: string;

  amount: number;

  paymentId: string;
}) {

  await this.creditWallet({

    userId,

    amount,

    referenceId:
    paymentId,

    note:
    'Wallet Recharge',
  });

  return {

    success: true,
  };
}

  async getWalletHistory(
    userId: string,
  ) {

    const transactions =
    await this.transactionModel
    .find({
      userId,
    })
    .sort({
      createdAt: -1,
    });

    return {

      success: true,

      data: transactions,
    };
  }

  async creditWallet({

    userId,

    amount,

    referenceId,

    note,
  }: {

    userId: string;

    amount: number;

    referenceId?: string;

    note?: string;
  }) {

    let wallet =
    await this.walletModel.findOne({
      userId,
    });

    if (!wallet) {

      wallet =
      await this.walletModel.create({

        userId,

        balance: 0,
      });
    }

    wallet.balance += amount;

    await wallet.save();

    await this.transactionModel.create({

      userId,

      amount,

      referenceId,

      note,

      type:
      WalletTransactionType.CREDIT,
    });

    return wallet;
  }

  async debitWallet({

    userId,

    amount,

    referenceId,

    note,
  }: {

    userId: string;

    amount: number;

    referenceId?: string;

    note?: string;
  }) {

    const wallet =
    await this.walletModel.findOne({
      userId,
    });

    if (!wallet) {

      throw new NotFoundException(
        'Wallet not found',
      );
    }

    if (
      wallet.balance < amount
    ) {

      throw new Error(
        'Insufficient balance',
      );
    }

    wallet.balance -= amount;

    await wallet.save();

    await this.transactionModel.create({

      userId,

      amount,

      referenceId,

      note,

      type:
      WalletTransactionType.DEBIT,
    });

    return wallet;
  }

  async cashback({

    userId,

    amount,

    orderId,
  }: {

    userId: string;

    amount: number;

    orderId: string;
  }) {

    return this.creditWallet({

      userId,

      amount,

      referenceId: orderId,

      note:
      'Cashback reward',
    });
  }

async refundOrder({
  userId,
  orderId,
  amount,
}: {
  userId: string;
  orderId: string;
  amount: number;
}) {
  let wallet =
    await this.walletModel.findOne({
      userId,
    });

  if (!wallet) {
    wallet =
      await this.walletModel.create({
        userId,
        balance: 0,
      });
  }

  wallet.balance += amount;

  await wallet.save();

  await this.transactionModel.create({
    userId,
    amount,
    type:
      WalletTransactionType.REFUND,
    referenceId: orderId,
    note:
      `Refund for Order ${orderId}`,
  });

  return wallet;
}
}