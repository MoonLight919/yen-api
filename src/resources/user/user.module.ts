import { Module } from '@nestjs/common';
import { ProfileController } from './controllers';
import { UserCoreModule } from './user-core.module';

@Module({
  imports: [UserCoreModule],
  controllers: [ProfileController],
})
export class UserModule {}
