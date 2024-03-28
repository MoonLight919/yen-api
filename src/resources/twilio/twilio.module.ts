import { Module } from '@nestjs/common';
import { AuthModule } from '@resources/auth/auth.module';
import { TwilioService } from './services';
import { TwilioController } from './controllers';

@Module({
  imports: [AuthModule],
  controllers: [TwilioController],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
