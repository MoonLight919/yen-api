import { forwardRef, Module } from '@nestjs/common';
import { KnexionModule } from '@knexion/core';
import { AuthModule } from '@resources/auth/auth.module';
import { NotificationDetailsRepository } from './repositories';
import { NotificationDetailsController } from './controllers';
import { NotificationDetailsService } from './services';

@Module({
  imports: [
    KnexionModule.forFeature([NotificationDetailsRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [NotificationDetailsController],
  providers: [NotificationDetailsService],
  exports: [NotificationDetailsService],
})
export class NotificationsModule {}
