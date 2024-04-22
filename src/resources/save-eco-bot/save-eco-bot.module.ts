import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@resources/auth/auth.module';
import { TwilioModule } from '@resources/twilio/twilio.module';
import { SaveEcoBotService } from './services';
import { SaveEcoBotController } from './controllers';

@Module({
  imports: [HttpModule, AuthModule, TwilioModule],
  controllers: [SaveEcoBotController],
  providers: [SaveEcoBotService],
  exports: [SaveEcoBotService],
})
export class SaveEcoBotModule {}
