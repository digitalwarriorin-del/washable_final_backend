import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  JwtService,
} from '@nestjs/jwt';

import {
  InjectModel,
} from '@nestjs/mongoose';

import {
  Model,
} from 'mongoose';

import admin from '../../config/firebase.config';

import {
  User,
} from '../../database/schemas/user.schema';

import {
  RefreshToken,
} from '../../database/schemas/refresh-token.schema';

import {
  Role,
} from '../../common/enums/role.enum';

import {
  Vendor,
} from '../../database/schemas/vendor.schema';

@Injectable()

export class AuthService {

constructor(

  @InjectModel(User.name)
  private userModel: Model<User>,

  @InjectModel(Vendor.name)
  private vendorModel: Model<Vendor>,

  @InjectModel(RefreshToken.name)
  private refreshTokenModel: Model<RefreshToken>,

  private jwtService: JwtService,
) {}

  async firebaseLogin(
    firebaseToken: string,
  ) {

    try {

      const decodedToken =
        await admin.auth()
          .verifyIdToken(
            firebaseToken,
          );

      const mobile =
        decodedToken.phone_number;

      let user =
        await this.userModel.findOne({
          mobile,
        });

      if (!user) {

        user =
          await this.userModel.create({

            mobile,

            role:
              Role.USER,

            name:
              'Washable User',
          });
      }

      const accessToken =
        this.generateAccessToken(
          user,
        );

      const refreshToken =
        this.generateRefreshToken(
          user,
        );

      await this.saveRefreshToken(
        user._id.toString(),
        refreshToken,
      );

      return {

        success: true,

        data: {

          accessToken,

          refreshToken,

          user,
        },
      };

    } catch (e) {

      throw new UnauthorizedException(
        'Invalid firebase token',
      );
    }
  }

  async login(
    mobile: string,
    role?: Role,
  ) {

    console.log('');

    console.log(
      '========== OTP ==========',
    );

    console.log(
      `Mobile: ${mobile}`,
    );

    console.log(
      `Role: ${role || Role.USER}`,
    );

    console.log(
      'OTP: 123456',
    );

    console.log(
      '=========================',
    );

    console.log('');

    return {

      success: true,

      message:
        'OTP sent successfully',

      data: {

        mobile,

        role:
          role || Role.USER,
      },
    };
  }

async verifyOtp(
  mobile: string,
  otp: string,
  role?: Role,
) {

  if (otp !== '123456') {
    throw new UnauthorizedException(
      'Invalid OTP',
    );
  }

  let user =
    await this.userModel.findOne({
      mobile,
    });

  if (!user) {

    const vendor =
      await this.vendorModel.findOne({
        mobile,
      });

    if (vendor && vendor.userId) {

      user =
        await this.userModel.findById(
          vendor.userId,
        );
    }

    if (!user) {

      user =
        await this.userModel.create({
          mobile,
          role: vendor
            ? Role.VENDOR
            : role || Role.USER,
        });

      if (vendor) {
        vendor.userId =
          user._id.toString();

        await vendor.save();
      }
    }
  }

  // ✅ Role validation
  if (
    role &&
    user.role !== role
  ) {
    throw new UnauthorizedException(
      `This number is registered as ${user.role}`,
    );
  }

  const accessToken =
    this.generateAccessToken(
      user,
    );

  const refreshToken =
    this.generateRefreshToken(
      user,
    );

  await this.saveRefreshToken(
    user._id.toString(),
    refreshToken,
  );

  console.log('');
  console.log(
    '====== TOKENS ======',
  );
  console.log(
    'ROLE:',
    user.role,
  );
  console.log(
    'ACCESS TOKEN:',
    accessToken,
  );
  console.log(
    'REFRESH TOKEN:',
    refreshToken,
  );
  console.log(
    '====================',
  );
  console.log('');

  return {
    success: true,
    message:
      'OTP verified successfully',
    data: {
      accessToken,
      refreshToken,
      user,
    },
  };
}
  async refreshToken(
    refreshToken: string,
  ) {

    const tokenDoc =
      await this.refreshTokenModel.findOne({
        token: refreshToken,
      });

    if (!tokenDoc) {

      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    try {

      const decoded =
        this.jwtService.verify(
          refreshToken,
          {
            secret:
              process.env.JWT_REFRESH_SECRET,
          },
        );

      const user =
        await this.userModel.findById(
          decoded.userId,
        );

      if (!user) {

        throw new UnauthorizedException(
          'User not found',
        );
      }

      const accessToken =
        this.generateAccessToken(
          user,
        );

      return {

        success: true,

        data: {
          accessToken,
        },
      };

    } catch (e) {

      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }
  }

  async saveFcmToken(userId: string, token: string) {
  await this.userModel.findByIdAndUpdate(userId, {
    fcmToken: token,
  });

  return { success: true };
}

  async logout(
    refreshToken: string,
  ) {

    await this.refreshTokenModel.deleteOne({
      token: refreshToken,
    });

    return {

      success: true,

      message:
        'Logout successful',
    };
  }

  private generateAccessToken(
    user: any,
  ) {

    return this.jwtService.sign(

      {

        userId:
          user._id.toString(),

        mobile:
          user.mobile,

        role:
          user.role,
      },

      {

        secret:
          process.env.JWT_SECRET,

        expiresIn: '7d',
      },
    );
  }

  private generateRefreshToken(
    user: any,
  ) {

    return this.jwtService.sign(

      {

        userId:
          user._id.toString(),
      },

      {

        secret:
          process.env.JWT_REFRESH_SECRET,

        expiresIn: '30d',
      },
    );
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ) {

    await this.refreshTokenModel.create({

      userId,

      token:
        refreshToken,

      expiresAt:
        new Date(

          Date.now()
          + 30
          * 24
          * 60
          * 60
          * 1000,
        ),
    });
  }
}