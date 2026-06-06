import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  UsersService,
} from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';


@Controller({
  path: 'users',
  version: '1',
})



export class UsersController {

  constructor(
    private readonly usersService:
      UsersService,
  ) {}

  // GET PROFILE
  @UseGuards(JwtAuthGuard)

  @Get('profile')
  async getProfile(
    @Req() req: any,
  ) {

    return this.usersService.getProfile(
      req.user.userId,
    );
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)

  @Patch('profile')
  async updateProfile(
    @Req() req: any,

    @Body()
    body: any,
  ) {

    return this.usersService.updateProfile(
      req.user.userId,
      body,
    );
  }

  // GET ALL USERS (ADMIN)
  @UseGuards(JwtAuthGuard)

  @Get()
  async getAllUsers() {

    return this.usersService.getAllUsers();
  }
}