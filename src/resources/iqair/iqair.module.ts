import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '@resources/auth/auth.module';
import { IpGeolocationModule } from '@resources/ip-geolocation/ip-geolocation.module';
import { IqAirService } from './services';
import { IqAirController } from './controllers';

@Module({
  imports: [HttpModule, AuthModule, IpGeolocationModule],
  controllers: [IqAirController],
  providers: [IqAirService],
  exports: [IqAirService],
})
export class IqAirModule {}
