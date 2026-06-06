import { Injectable }
from '@nestjs/common';

import { Cron }
from '@nestjs/schedule';

@Injectable()

export class SettlementJob {
  @Cron('0 0 1 * *')
  async monthlySettlement() {
    console.log(
      'Monthly vendor settlement',
    );
  }
}