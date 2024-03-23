import { forwardRef, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationGuard } from '@resources/auth/guards';
import { UserModule } from '../user/user.module';
import { Auth0Controller } from './controllers';
import { AuthenticationService, AuthService, JwtService } from './services';
import { AuthExceptionFilter } from './filters';

@Module({
  imports: [forwardRef(() => UserModule), HttpModule],
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
