import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationService, JwtService } from './services';
import { AuthenticationGuard } from './guards';

@Global()
@Module({
  imports: [UserModule],
  providers: [
    JwtService,
    AuthenticationService,
    AuthenticationGuard,
  ],
  exports: [
    JwtService,
    AuthenticationService,
    AuthenticationGuard,
  ],
})
export class AuthCoreModule {}
