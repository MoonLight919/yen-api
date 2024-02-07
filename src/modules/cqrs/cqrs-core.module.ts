import {
  Global,
  Module,
  type DynamicModule,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { QueryBus, UnhandledExceptionBus } from '@nestjs/cqrs';
import { EventBusTransaction } from './lib';
import { CommandBus } from './command-bus';
import { EventBus } from './event-bus';
import { type IEvent } from './interfaces';

@Global()
@Module({})
export class CqrsCoreModule<EventBase extends IEvent = IEvent>
  implements OnApplicationBootstrap
{
  static forRoot(): DynamicModule {
    return {
      module: CqrsCoreModule,
      providers: [
        EventBus,
        QueryBus,
        CommandBus,
        ExplorerService,
        EventBusTransaction,
        UnhandledExceptionBus,
      ],
      exports: [
        EventBus,
        QueryBus,
        CommandBus,
        EventBusTransaction,
        UnhandledExceptionBus,
      ],
    };
  }

  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly explorerService: ExplorerService<EventBase>,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const { sagas, events, queries, commands } = this.explorerService.explore();
    this.eventBus.register(events);
    this.queryBus.register(queries);
    this.eventBus.registerSagas(sagas);
    this.commandBus.register(commands);
  }
}
