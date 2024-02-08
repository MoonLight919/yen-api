import { Module } from '@nestjs/common';
import { KnexionModule } from '@knexion/core';
import { UserService } from '@resources/user/services';
import { UserRepository } from '@resources/user/repositories';
import { ProfileController } from './controllers';

@Module({
  imports: [KnexionModule.forFeature([UserRepository])],
  controllers: [ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
