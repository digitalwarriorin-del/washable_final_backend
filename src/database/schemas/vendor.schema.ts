import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
} from 'mongoose';

export type VendorDocument =
  HydratedDocument<Vendor>;

@Schema({
  timestamps: true,
})

export class Vendor {

  @Prop()
fcmToken?: string;

  @Prop({
    required: true,
  })
  ownerName!: string;

  @Prop({
    required: true,
  })
  shopName!: string;

  @Prop({
    required: true,
    unique: true,
  })
  mobile!: string;

  @Prop({
    required: true,
  })
  shopAddress!: string;

 @Prop({
  required: true,
  unique: true,
})
userId!: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location!: {
    type: 'Point';
    coordinates: number[];
  };

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const VendorSchema =
  SchemaFactory.createForClass(
    Vendor,
  );

VendorSchema.index({
  location: '2dsphere',
});