import { Injectable } from '@nestjs/common';
import { type ID, type List, type ListSelectDatabaseOptions } from '@lib/db';
import { type ServiceOptions } from '@lib/interfaces';
import { NotificationDetailsRepository } from '../repositories';
import {
  type CreateNotificationDetailsPayload,
  type NotificationDetailsRecord,
  type UpdateNotificationDetailsPayload,
} from '../contracts';

@Injectable()
export class NotificationDetailsService {
  constructor(
    private readonly notificationDetailsRepository: NotificationDetailsRepository,
  ) {}

  public async list(
    filters: Partial<NotificationDetailsRecord>,
    options?: ListSelectDatabaseOptions<
      NotificationDetailsRecord,
      NotificationDetailsRecord
    >,
  ): Promise<List<NotificationDetailsRecord>> {
    return this.notificationDetailsRepository.list({
      ...options,
      filter: filters,
    });
  }

  public async update(
    id: ID,
    payload: UpdateNotificationDetailsPayload,
    options?: ServiceOptions<
      NotificationDetailsRecord,
      NotificationDetailsRecord
    >,
  ): Promise<NotificationDetailsRecord | null> {
    return this.notificationDetailsRepository.update(id, payload, options);
  }

  public async create(
    payload: CreateNotificationDetailsPayload,
    options?: ServiceOptions<
      NotificationDetailsRecord,
      NotificationDetailsRecord
    >,
  ): Promise<NotificationDetailsRecord> {
    return this.notificationDetailsRepository.create(
      {
        ...payload,
        upper_border: payload.upper_border ?? null,
        lower_border: payload.lower_border ?? null,
        trigger_value: payload.trigger_value ?? null,
        upper_border_active: payload.upper_border_active ?? false,
        lower_border_active: payload.lower_border_active ?? false,
        default_location: payload.default_location ?? true,
        active: payload.active ?? false,
        alert_in_progress: false,
      },
      options,
    );
  }
}
