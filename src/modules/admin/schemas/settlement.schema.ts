import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument }
from 'mongoose';

export type SettlementDocument =
  HydratedDocument<Settlement>;

@Schema({
  timestamps: true,
})

export class Settlement {

  @Prop({
    required: true,
  })
  vendorId!: string;

  @Prop({
    required: true,
  })
  amount!: number;

  @Prop({
    required: true,
  })
  month!: string;

  @Prop({
    default: false,
  })
  isPaid!: boolean;
}

export const SettlementSchema =
  SchemaFactory.createForClass(
    Settlement,
  );