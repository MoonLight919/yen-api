import { Module } from '@nestjs/common';
import { ValidationModule } from 'nestjs-validation';
import { KnexionModule } from '@knexion/core';
import { LoggerModule } from '@modules/logger/logger.module';
import { ConfigModule } from '@modules/config/config.module';
import { CoreModule } from '@modules/core/core.module';
import { HealthCheckModule } from '@modules/health-check/health-check.module';
import { TransactionModule } from '@modules/transaction';
import { dbConfig, type DBConfig } from '@config/db.config';
import { type AppConfig, appConfig } from '@config/app.config';
import { AjvResolverModule } from '@modules/ajv-resolver';
import { IpGeolocationModule } from '@resources/ip-geolocation/ip-geolocation.module';
import { IqAirModule } from '@resources/iqair/iqair.module';
import { AlertsInUaModule } from '@resources/alerts-in-ua/alerts-in-ua.module';
import { NotificationsModule } from '@resources/notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TwilioModule } from './twilio/twilio.module';
import { SaveEcoBotModule } from './save-eco-bot/save-eco-bot.module';

@Module({
  imports: [
    KnexionModule.forRootAsync({
      useFactory: (config: DBConfig, appConfig: AppConfig) => ({
        client: 'pg',
        connection: {
          ...config.connection,
          application_name: appConfig.name,
        },
        pool: config.pool,
        asyncStackTraces: config.asyncStackTraces,
      }),
      inject: [dbConfig.KEY, appConfig.KEY],
    }),
    ValidationModule.forRoot(),
    ConfigModule,
    LoggerModule,
    TransactionModule,
    CoreModule,
    HealthCheckModule,
    AjvResolverModule,
    AuthModule,
    UserModule,
    IpGeolocationModule,
    IqAirModule,
    AlertsInUaModule,
    TwilioModule,
    SaveEcoBotModule,
    NotificationsModule,
  ],
})
export class AppModule {}
