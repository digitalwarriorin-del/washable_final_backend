import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {

  async sendToToken(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    if (!token) return;

    try {
      await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
        data: data || {},
      });
    } catch (error) {
      console.error('FCM Error:', error);
    }
  }
}