import { Twilio } from 'twilio';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { twilioConfig as tc } from '@config/twilio.config';
import { type TwilioMessageOptions } from '../interfaces';

@Injectable()
export class TwilioService {
  private client: Twilio;
  private readonly logger = new Logger('TwilioService');
  constructor(
    @Inject(tc.KEY)
    private readonly twilioConfig: ConfigType<typeof tc>,
  ) {
    this.initClient();
  }

  public async notify(phoneNumber: string, body: string): Promise<void> {
    await this.sendMessage({
      to: phoneNumber,
      body,
    });
  }

  public async testMessage(phoneNumber: string): Promise<void> {
    await this.sendMessage({
      to: phoneNumber,
      body: 'This is your test message from YeNebezpeka!',
    });
  }

  private async sendMessage(
    messageOptions: TwilioMessageOptions,
  ): Promise<void> {
    try {
      await this.client.messages.create({
        from: 'YeNebezpeka',
        to: messageOptions.to,
        body: messageOptions.body,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  private initClient(): void {
    this.client = new Twilio(
      this.twilioConfig.accountSid,
      this.twilioConfig.authToken,
    );
  }
}
