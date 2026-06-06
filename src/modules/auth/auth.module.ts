import { Module } from '@nestjs/common';

import { JwtModule }
from '@nestjs/jwt';

import { PassportModule }
from '@nestjs/passport';

import { MongooseModule }
from '@nestjs/mongoose';

import { AuthController }
from './auth.controller';

import { AuthService }
from './auth.service';

import {
  Vendor,
  VendorSchema,
} from '../../database/schemas/vendor.schema';

import {
  User,
  UserSchema,
} from '../../database/schemas/user.schema';

import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../database/schemas/refresh-token.schema';

import { JwtStrategy }
from './strategies/jwt.strategy';

@Module({

  imports: [

    PassportModule,

    JwtModule.register({

      secret:
        process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '7d',
      },
    }),

MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },

  {
    name: Vendor.name,
    schema: VendorSchema,
  },

  {
    name: RefreshToken.name,
    schema: RefreshTokenSchema,
  },
]),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    JwtModule,
  ],
})

export class AuthModule {}