import { type Subject } from 'rxjs';
import { type IEventPublisher } from '@nestjs/cqrs';
import {
  type IEvent,
  type PublishOptions,
  type IStaticJsonSerializable,
} from './interfaces';
import { reflectTopicMetadata } from './utils';

export class EventPublisher<T extends IEvent = IEvent>
  implements IEventPublisher<T>
{
  constructor(private subject$: Subject<T>) {}

  public async publish(event: T, options?: PublishOptions): Promise<void> {
    const topic = reflectTopicMetadata(event);
    if (!topic) {
      throw new Error(
        `No topics are provided for event "${event.constructor.name}"`,
      );
    }
    const copyEvent = (
      event.constructor as IStaticJsonSerializable<new () => T, T>
    ).fromJson(event.toJson());

    if (options?.transaction) {
      await options.transaction.send(() => this.subject$.next(copyEvent));
    } else {
      await this.subject$.next(copyEvent);
    }
  }
}
