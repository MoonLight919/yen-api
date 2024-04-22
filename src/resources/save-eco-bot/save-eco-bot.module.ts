import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@resources/auth/auth.module';
import { TwilioModule } from '@resources/twilio/twilio.module';
import { SaveEcoBotService } from './services';

@Module({
  imports: [HttpModule, AuthModule, TwilioModule],
  providers: [SaveEcoBotService],
  exports: [SaveEcoBotService],
})
export class SaveEcoBotModule {}
