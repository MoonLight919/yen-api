import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@modules/cqrs';
import { TransactionService } from './services';

@Global()
@Module({
  imports: [CqrsModule.forRoot()],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
