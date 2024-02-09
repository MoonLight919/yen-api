import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { dbConfig } from '@config/db.config';
import { appConfig } from '@config/app.config';
import { auth0Config } from '@config/auth0.config';
import { featuresConfig } from '@config/features.config';
import { ipGeolocationConfig } from '@config/ip-geolocation.config';
import { iqAirConfig } from '@config/iqair.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [
        appConfig,
        auth0Config,
        dbConfig,
        featuresConfig,
        ipGeolocationConfig,
        iqAirConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
