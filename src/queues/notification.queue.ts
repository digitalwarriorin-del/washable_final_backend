import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import { Job }
from 'bullmq';

@Processor('notifications')

export class NotificationQueue
  extends WorkerHost
{
  async process(job: Job) {
    console.log(
      'Sending notification:',
      job.data,
    );
  }
}