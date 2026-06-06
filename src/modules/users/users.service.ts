import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectModel,
} from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  User,
} from '../../database/schemas/user.schema';

import {
  UpdateProfileDto,
} from './dto/update-profile.dto';

@Injectable()

export class UsersService {

  constructor(

    @InjectModel(User.name)
    private userModel:
      Model<User>,
  ) {}

  async getProfile(
    userId: string,
  ) {

    const user =
      await this.userModel.findById(
        userId,
      );

    if (!user) {

      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      success: true,
      data: user,
    };
  }

  async updateProfile(
    userId: string,

    body:
      UpdateProfileDto,
  ) {

    const user =
      await this.userModel.findByIdAndUpdate(

        userId,

        {
          $set: body,
        },

        {
          new: true,
        },
      );

    return {
      success: true,
      message:
        'Profile updated successfully',

      data: user,
    };
  }

  async getAllUsers() {

  const users =
    await this.userModel.find();

  return {

    success: true,

    data: users,
  };
}
}