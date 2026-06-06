import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
} from 'mongoose';

export type WalletTransactionDocument =
  HydratedDocument<WalletTransaction>;

export enum WalletTransactionType {

  CREDIT = 'CREDIT',

  DEBIT = 'DEBIT',

  REFUND = 'REFUND',

  CASHBACK = 'CASHBACK',
}

@Schema({
  timestamps: true,
})
export class WalletTransaction {

  @Prop({
    required: true,
  })
  userId!: string;

  @Prop({
    required: true,
  })
  amount!: number;

  @Prop({
    required: true,
    enum:
      WalletTransactionType,
  })
  type!: WalletTransactionType;

  @Prop()
  referenceId?: string;

  @Prop()
  note?: string;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(
    WalletTransaction,
  );