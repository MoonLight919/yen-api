import { registerAs } from '@nestjs/config';

export const twilioConfig = registerAs('twilio', () => ({
  accountSid:
    process.env.TWILIO_ACCOUNT_SID ?? 'AC_TWILIO_ACCOUNT_SID_NOT_SPECIFIED',
  authToken: process.env.TWILIO_AUTH_TOKEN ?? 'TWILIO_AUTH_TOKEN_NOT_SPECIFIED',
  twilioNumber:
    process.env.TWILIO_PHONE_NUMBER ?? 'TWILIO_PHONE_NUMBER_NOT_SPECIFIED',
}));
