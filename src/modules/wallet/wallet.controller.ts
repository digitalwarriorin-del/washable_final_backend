import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

import { CreditWalletDto } from './dto/credit-wallet.dto';
import { DebitWalletDto } from './dto/debit-wallet.dto';

@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ================= CREDIT =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('credit')
  async creditWallet(@Body() body: CreditWalletDto) {
    return this.walletService.creditWallet({
      userId: body.userId,
      amount: body.amount,
      note: body.note,
    });
  }

  // ================= DEBIT =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('debit')
  async debitWallet(@Body() body: DebitWalletDto) {
    return this.walletService.debitWallet({
      userId: body.userId,
      amount: body.amount,
      note: body.note,
    });
  }

  // ================= RECHARGE ORDER =================
  @UseGuards(JwtAuthGuard)
  @Post('recharge')
  async createRechargeOrder(
    @Req() req,
    @Body() body: { amount: number },
  ) {
    if (!body.amount || body.amount <= 0) {
      throw new Error('Invalid amount');
    }

    return this.walletService.createRechargeOrder(
      req.user.userId,
      body.amount,
    );
  }

  // ================= VERIFY RECHARGE =================
  @UseGuards(JwtAuthGuard)
  @Post('verify-recharge')
  async verifyRecharge(
    @Req() req,
    @Body()
    body: {
      amount: number;
      paymentId: string;
    },
  ) {
    if (!body.paymentId) {
      throw new Error('Payment ID required');
    }

    return this.walletService.verifyRecharge({
      userId: req.user.userId,
      amount: body.amount,
      paymentId: body.paymentId,
    });
  }

  // ================= WALLET =================
  @UseGuards(JwtAuthGuard)
  @Get()
  async getWallet(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.walletService.getWallet(req.user.userId);
  }

  // ================= HISTORY =================
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async walletHistory(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.walletService.getWalletHistory(req.user.userId);
  }
}