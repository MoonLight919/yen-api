import { type IEvent as INestDefaultEvent } from '@nestjs/cqrs';
import { type ID } from '@lib/db';
import { type IJsonSerializable } from './json-serializable.interface';

export interface IEvent extends IJsonSerializable, INestDefaultEvent {
  id: string;
  version: string;
  type: string;
  traceId: string;
}

export interface EventData<T> {
  object: T;
  previous_attributes?: Partial<T>;
}

export interface EventPayload<T> {
  id: string;
  version: string;
  type: string;
  created_at: number;
  request: EventRequest;
  data: EventData<T>;
}

export interface EventRequest {
  traceId: string;
  parentTraceId?: string;
  user: ID;
}
