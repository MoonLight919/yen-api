import { forwardRef, Module } from '@nestjs/common';
import { KnexionModule } from '@knexion/core';
import { AuthModule } from '@resources/auth/auth.module';
import { AlertsInUaModule } from '@resources/alerts-in-ua/alerts-in-ua.module';
import { IqAirModule } from '@resources/iqair/iqair.module';
import { UserModule } from '@resources/user/user.module';
import { SaveEcoBotModule } from '@resources/save-eco-bot/save-eco-bot.module';
import { NotificationDetailsRepository } from './repositories';
import { NotificationDetailsController } from './controllers';
import { NotificationDetailsService, NotificationService } from './services';

@Module({
  imports: [
    KnexionModule.forFeature([NotificationDetailsRepository]),
    forwardRef(() => AuthModule),
    AlertsInUaModule,
    UserModule,
    IqAirModule,
    SaveEcoBotModule,
  ],
  controllers: [NotificationDetailsController],
  providers: [NotificationDetailsService, NotificationService],
  exports: [NotificationDetailsService, NotificationService],
})
export class NotificationsModule {}
