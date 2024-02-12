import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '@resources/user/user.module';
import { AlertsInUaService } from './services';
import { AlertsInUaController } from './controllers';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [AlertsInUaController],
  providers: [AlertsInUaService],
  exports: [AlertsInUaService],
})
export class AlertsInUaModule {}
