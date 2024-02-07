import { Module, type DynamicModule } from '@nestjs/common';
import { CqrsCoreModule } from './cqrs-core.module';

@Module({})
export class CqrsModule {
  static forRoot(): DynamicModule {
    return {
      module: CqrsModule,
      imports: [CqrsCoreModule.forRoot()],
    };
  }
}
