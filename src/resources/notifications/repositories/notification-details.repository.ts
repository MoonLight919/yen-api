import { type DatabaseOptions, KnexionRepository } from '@knexion/core';
import { type ID, type OmitDefaultResourceFields, Repository } from '@lib/db';
import { type NotificationDetailsRecord } from '../contracts';

@KnexionRepository({ name: 'notification-details' })
export class NotificationDetailsRepository extends Repository<NotificationDetailsRecord> {
  public async update(
    id: ID,
    payload: Partial<OmitDefaultResourceFields<NotificationDetailsRecord>>,
    options?: DatabaseOptions<
      NotificationDetailsRecord,
      NotificationDetailsRecord
    >,
  ): Promise<NotificationDetailsRecord | null> {
    return super.update(id, payload, options);
  }

  public async create(
    payload: OmitDefaultResourceFields<NotificationDetailsRecord>,
    options?: DatabaseOptions<
      NotificationDetailsRecord,
      NotificationDetailsRecord
    >,
  ): Promise<NotificationDetailsRecord> {
    return super.create(payload, options);
  }
}
