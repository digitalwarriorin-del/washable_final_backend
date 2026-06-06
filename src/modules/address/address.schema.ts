import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop()
  name!: string;

  @Prop()
  phone!: string;

  @Prop()
  addressLine!: string;

  @Prop()
  city!: string;

  @Prop()
  state!: string;

  @Prop()
  pincode!: string;

  @Prop({ default: false })
  isDefault!: boolean;
}