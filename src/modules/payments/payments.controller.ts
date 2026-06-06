import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { PaymentsService }
from './payments.service';

@Controller({
  path: 'payments',
  version: '1',
})

export class PaymentsController {

  constructor(
    private readonly paymentsService:
      PaymentsService,
  ) {}

  @Post('verify')

  async verifyPayment(
    @Body() body: any,
  ) {

    return this.paymentsService
      .verifyPayment(body);
  }
}