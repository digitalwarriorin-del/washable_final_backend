import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
} from 'mongoose';

import {
  Role,
} from '../../common/enums/role.enum';

export type UserDocument =
  HydratedDocument<User>;

@Schema({
  timestamps: true,
})

export class User {

  @Prop()
fcmToken?: string;

  @Prop({
    default: 0,
  })
  walletBalance!: number;

  @Prop({
    default: 0,
  })
  cashbackBalance!: number;

  @Prop({
    default: '',
  })
  name?: string;

  @Prop({
    required: true,
    unique: true,
  })
  mobile!: string;

  @Prop({
    default: '',
  })
  email?: string;

  @Prop({
    default: '',
  })
  profileImage?: string;

  @Prop({
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const UserSchema =
  SchemaFactory.createForClass(
    User,
  );