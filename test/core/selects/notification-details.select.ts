import { type NotificationDetailsRecord } from '@resources/notifications/contracts';
import { notificationDetailsRepository } from '../lib/database/repositories';

export function selectAllNotificationDetails(): Promise<NotificationDetailsRecord> {
  return notificationDetailsRepository().select('*');
}

export function selectNotificationDetailsBy(
  filters: Partial<NotificationDetailsRecord>,
): Promise<NotificationDetailsRecord> {
  return notificationDetailsRepository()
    .select('*')
    .where(filters)
    .first<NotificationDetailsRecord>();
}
