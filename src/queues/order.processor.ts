import { Worker } from 'bullmq';

export const orderWorker = new Worker('orderQueue', async job => {
  console.log('Processing order:', job.data);
});