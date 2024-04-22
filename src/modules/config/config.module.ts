import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { dbConfig } from '@config/db.config';
import { appConfig } from '@config/app.config';
import { auth0Config } from '@config/auth0.config';
import { featuresConfig } from '@config/features.config';
import { ipGeolocationConfig } from '@config/ip-geolocation.config';
import { iqAirConfig } from '@config/iqair.config';
import { alertsInUaConfig } from '@config/alerts-in-ua.config';
import { twilioConfig } from '@config/twilio.config';
import { saveEcoBotConfig } from '@config/save-eco-bot.config';

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
        alertsInUaConfig,
        twilioConfig,
        saveEcoBotConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
