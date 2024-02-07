import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from '../user/user.module';
import { Auth0Controller } from './controllers';
import { AuthService } from './services';
import { AuthExceptionFilter } from './filters';
import { AuthCoreModule } from './auth-core.module';

@Module({
  imports: [AuthCoreModule, UserModule],
  controllers: [Auth0Controller],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    AuthService,
  ],
})
export class AuthModule {}
