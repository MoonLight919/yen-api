import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '@resources/user/user.module';
import { IpGeolocationModule } from '@resources/ip-geolocation/ip-geolocation.module';
import { IqAirService } from './services';
import { IqAirController } from './controllers';

@Module({
  imports: [HttpModule, UserModule, IpGeolocationModule],
  controllers: [IqAirController],
  providers: [IqAirService],
  exports: [IqAirService],
})
export class IqAirModule {}
