import { applyDecorators, SetMetadata } from '@nestjs/common';
import { CQRS_EVENT_OPTIONS } from '../cqrs.constants';
import { Topic } from './topic.decorator';

export const CqrsEvent = (
  topic: string,
): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) =>
  applyDecorators(Topic(topic), SetMetadata(CQRS_EVENT_OPTIONS, {}));
