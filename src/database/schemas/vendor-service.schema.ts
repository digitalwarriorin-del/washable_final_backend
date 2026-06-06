import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type VendorServiceDocument =
  HydratedDocument<VendorService>;

@Schema({
  timestamps: true,
})

export class VendorService {

  @Prop({
    type: Types.ObjectId,
    ref: 'Vendor',
  })

  vendorId!: Types.ObjectId;

  @Prop({
    required: true,
  })

  serviceName!: string;

  @Prop({
    required: true,
  })

  price!: number;

  @Prop({
    required: true,
  })

  duration!: string;

  @Prop()

  image!: string;

  @Prop({
    default: true,
  })

  isAvailable!: boolean;
}

export const VendorServiceSchema =
  SchemaFactory.createForClass(
    VendorService,
  );