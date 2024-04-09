import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@resources/auth/auth.module';
import { TwilioModule } from '@resources/twilio/twilio.module';
import { AlertsInUaService } from './services';
import { AlertsInUaController } from './controllers';

@Module({
  imports: [HttpModule, AuthModule, TwilioModule],
  controllers: [AlertsInUaController],
  providers: [AlertsInUaService],
  exports: [AlertsInUaService],
})
export class AlertsInUaModule {}
