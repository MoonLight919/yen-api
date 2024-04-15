import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@resources/auth/auth.module';
import { TwilioModule } from '@resources/twilio/twilio.module';
import { IqAirService } from './services';
import { IqAirController } from './controllers';

@Module({
  imports: [HttpModule, AuthModule, TwilioModule],
  controllers: [IqAirController],
  providers: [IqAirService],
  exports: [IqAirService],
})
export class IqAirModule {}
