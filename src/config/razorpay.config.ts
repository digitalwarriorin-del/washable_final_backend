import * as dotenv from 'dotenv';

dotenv.config();

import Razorpay from 'razorpay';

const keyId =
  process.env.RAZORPAY_KEY_ID;

const keySecret =
  process.env.RAZORPAY_KEY_SECRET;

console.log('KEY ID:', keyId);
console.log('KEY SECRET:', keySecret);

if (!keyId || !keySecret) {

  throw new Error(
    'Razorpay keys missing in .env',
  );
}

export const razorpay =
  new Razorpay({

    key_id: keyId,

    key_secret: keySecret,
  });