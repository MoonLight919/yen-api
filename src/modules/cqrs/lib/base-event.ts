import { randomUUID } from 'crypto';
import { MetadataContainer } from '@modules/core/metadata';
import { reflect, now } from '@utils';
import { TOPIC_METADATA, EVENT_VERSION_METADATA } from '../cqrs.constants';
import {
  type EventRequest,
  type EventPayload,
  type IEvent,
} from '../interfaces';

export class BaseEvent implements IEvent {
  static parseEventMessage<Payload>(message: string): EventPayload<Payload> {
    return JSON.parse(message) as EventPayload<Payload>;
  }

  static eventRequestToMetadata(eventRequest: EventRequest): MetadataContainer {
    return new MetadataContainer(
      eventRequest.traceId,
      eventRequest.parentTraceId,
    ).setIdUser(eventRequest.user);
  }

  static metadataToEventRequest(metadata: MetadataContainer): EventRequest {
    return {
      traceId: metadata.traceId,
      parentTraceId: metadata.parentTraceId,
      user: metadata.idUser,
    };
  }

  public readonly traceId: string;
  public readonly version: string;
  public readonly type: string;
  public metadata: MetadataContainer;

  constructor(
    public readonly parentMetadata: MetadataContainer,
    public readonly id: string = randomUUID(),
  ) {
    const eventVersion =
      reflect<string>(this.constructor, EVENT_VERSION_METADATA) ?? '1';
    const topic = reflect<string>(this.constructor, TOPIC_METADATA);
    if (!topic) {
      throw new Error(`Can't reflect topic metadata`);
    }
    this.type = topic;
    this.version = eventVersion;
    this.traceId = parentMetadata.traceId;
    this.metadata = parentMetadata;
  }

  public toJson(payload: unknown, previousAttributes?: unknown): string {
    let data: Record<string, unknown> = {
      object: payload,
    };
    if (previousAttributes) {
      data = {
        ...data,
        previous_attributes: previousAttributes,
      };
    }
    return JSON.stringify({
      id: this.id,
      version: this.version,
      type: this.type,
      request: BaseEvent.metadataToEventRequest(this.metadata),
      created_at: now(),
      data,
    });
  }
}
