import { EventBus as NestEventBus, UnhandledExceptionBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus } from './command-bus';
import { EventPublisher } from './event-publisher';
import { type IEvent, type PublishOptions } from './interfaces';

@Injectable()
export class EventBus<
  EventBase extends IEvent = IEvent,
> extends NestEventBus<EventBase> {
  private readonly _eventPublisher: EventPublisher<EventBase>;

  constructor(
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    unhandledExceptionBus: UnhandledExceptionBus,
  ) {
    // @ts-expect-error constructor of `EventBus` accepts only exactly one `CommandBus` but not the contractor
    super(commandBus, moduleRef, unhandledExceptionBus);
    this._eventPublisher = new EventPublisher<EventBase>(this.subject$);
  }

  public async publish<T extends EventBase>(
    event: T,
    options?: PublishOptions,
  ): Promise<void> {
    this._eventPublisher.publish(event, options);
  }
}
