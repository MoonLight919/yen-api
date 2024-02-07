import { Global, Module } from '@nestjs/common';
import { KnexionModule } from '@knexion/core';
import { UserService } from './services';
import { UserRepository } from './repositories';

@Global()
@Module({
  imports: [KnexionModule.forFeature([UserRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserCoreModule {}
