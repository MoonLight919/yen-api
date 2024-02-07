import { TOPIC_METADATA } from '../cqrs.constants';

export const Topic = (topic: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(TOPIC_METADATA, topic, target);
  };
};
