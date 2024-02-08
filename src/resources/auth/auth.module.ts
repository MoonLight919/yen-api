import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthenticationGuard } from '@resources/auth/guards';
import { UserModule } from '../user/user.module';
import { Auth0Controller } from './controllers';
import { AuthenticationService, AuthService, JwtService } from './services';
import { AuthExceptionFilter } from './filters';

@Module({
  imports: [UserModule],
  controllers: [Auth0Controller],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    AuthService,
    JwtService,
    AuthenticationService,
    AuthenticationGuard,
  ],
  exports: [JwtService, AuthenticationService, AuthenticationGuard],
})
export class AuthModule {}
