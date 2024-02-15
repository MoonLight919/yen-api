import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@resources/auth/auth.module';
import { IpGeolocationService } from './services';
import { IpGeolocationController } from './controllers';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [IpGeolocationController],
  providers: [IpGeolocationService],
  exports: [IpGeolocationService],
})
export class IpGeolocationModule {}
