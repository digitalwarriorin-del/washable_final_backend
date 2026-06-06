import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
} from 'mongoose';

export type ServiceDocument =
  HydratedDocument<Service>;

export enum ServiceCategory {
  // Core services
  WASH = 'WASH',
  DRY_CLEAN = 'DRY_CLEAN',
  IRON = 'IRON',
  PREMIUM = 'PREMIUM',
  STAIN = 'STAIN',
  BULK = 'BULK',
  SHOES = 'SHOES',

  // Household / fabric services
  CURTAIN = 'CURTAIN',
  CURTAINS_SMALL = 'CURTAINS_SMALL',
  CURTAINS_HEAVY = 'CURTAINS_HEAVY',
  BLANKET = 'BLANKET',
  BED_SHEET = 'BED_SHEET',
  CARPET = 'CARPET',

  // Clothing services
  T_SHIRT = 'T_SHIRT',
  SHIRT = 'SHIRT',
  JEANS = 'JEANS',
  TROUSER = 'TROUSER',
  HOODIE = 'HOODIE',
  FORMAL = 'FORMAL',
  SAREE = 'SAREE',
  SPORTSWEAR = 'SPORTSWEAR',
  INNERWEAR = 'INNERWEAR',
  BABY = 'BABY',

  // Special services
  LEATHER = 'LEATHER',
  EXPRESS = 'EXPRESS',
  HEAVY = 'HEAVY',
}

@Schema({
  timestamps: true,
})

export class Service {

  @Prop({
    required: true,
  })
  vendorId!: string;

  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
    default: '',
  })
  description!: string;

  @Prop({
    enum: ServiceCategory,
    required: true,
  })
  category!: ServiceCategory;

  @Prop({
    type: Array,
    default: [],
  })
  pricing!: {
    title: string;
    price: number;
    estimatedHours: number;
  }[];


    // ✅ ADDED ICON FIELD
  @Prop({ default: 'local_laundry_service' })
  icon!: string;

  @Prop({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
})
location!: {
  type: 'Point';
  coordinates: number[];
};
@Prop({
  default: 5, // km
})
serviceRadiusKm!: number;



  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const ServiceSchema =
  SchemaFactory.createForClass(
    Service,
  );

  // 👇 ADD THIS LINE HERE (IMPORTANT)
ServiceSchema.index(
  {
    vendorId: 1,
    category: 1,
  },
  {
    unique: true,
  },
);