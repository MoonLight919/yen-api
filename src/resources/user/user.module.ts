import { forwardRef, Module } from '@nestjs/common';
import { KnexionModule } from '@knexion/core';
import { UserService } from '@resources/user/services';
import { UserRepository } from '@resources/user/repositories';
import { AuthModule } from '@resources/auth/auth.module';
import { ProfileController } from './controllers';

@Module({
  imports: [
    KnexionModule.forFeature([UserRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
