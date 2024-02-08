import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '@resources/user/user.module';
import { IpGeolocationService } from './services';
import { IpGeolocationController } from './controllers';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [IpGeolocationController],
  providers: [IpGeolocationService],
  exports: [IpGeolocationService],
})
export class IpGeolocationModule {}
