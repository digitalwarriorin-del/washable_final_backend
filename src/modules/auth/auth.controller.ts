import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  AuthService,
} from './auth.service';

import {
  LoginDto,
} from './dto/login.dto';

import {
  VerifyOtpDto,
} from './dto/verify-otp.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})

export class AuthController {

  constructor(
    private readonly authService:
      AuthService,
  ) {}

  @Post('login')
  async login(
    @Body()
    body: LoginDto,
  ) {

    return this.authService.login(

      body.mobile,

      body.role,
    );
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body()
    body: VerifyOtpDto,
  ) {

    return this.authService.verifyOtp(

      body.mobile,

      body.otp,

      body.role,
    );
  }

  @Post('refresh')
  async refresh(
    @Body()
    body: {
      refreshToken: string;
    },
  ) {

    return this.authService.refreshToken(
      body.refreshToken,
    );
  }
@Post('save-fcm-token')
@UseGuards(JwtAuthGuard)
async saveToken(
  @Req() req,
  @Body() body: { token: string },
) {
  return this.authService.saveFcmToken(
    req.user.userId,
    body.token,
  );
}
  @Post('logout')
  async logout(
    @Body()
    body: {
      refreshToken: string;
    },
  ) {

    return this.authService.logout(
      body.refreshToken,
    );
  }
}