import { type Type } from '@nestjs/common';
import { reflect } from '@utils';
import { TOPIC_METADATA } from '../cqrs.constants';
import {
  type IEvent,
  type IJsonSerializable,
  type IStaticJsonSerializable,
} from '../interfaces';

export const reflectTopicMetadata = <EventBase extends IEvent = IEvent>(
  event:
    | EventBase
    | Type<EventBase>
    | FunctionConstructor
    | IStaticJsonSerializable<Type<IJsonSerializable>, EventBase>,
): string | null => {
  return reflect<string>(event, TOPIC_METADATA);
};
