import { Module } from '@nestjs/common';
import { TwilioService } from './services';

@Module({
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
