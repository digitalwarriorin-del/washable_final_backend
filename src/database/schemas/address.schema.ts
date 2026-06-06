import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument }
from 'mongoose';

export type AddressDocument =
  HydratedDocument<Address>;

@Schema({
  timestamps: true,
})

export class Address {

  @Prop({
    required: true,
  })
  userId!: string;

  @Prop({
    required: true,
  })
  fullName!: string;

  @Prop({
    required: true,
  })
  mobile!: string;

  @Prop({
    required: true,
  })
  addressLine1!: string;

  @Prop()
  addressLine2?: string;

  @Prop({
    required: true,
  })
  city!: string;

  @Prop({
    required: true,
  })
  state!: string;

  @Prop({
    required: true,
  })
  pincode!: string;

  @Prop({
    required: true,
  })
  latitude!: number;

  @Prop({
    required: true,
  })
  longitude!: number;

  @Prop({
    default: false,
  })
  isDefault!: boolean;
}

export const AddressSchema =
  SchemaFactory.createForClass(
    Address,
  );