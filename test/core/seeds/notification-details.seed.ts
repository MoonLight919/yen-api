import { type NotificationDetailsRecord } from '@resources/notifications/contracts';
import { notificationDetailsRepository } from '../lib/database/repositories';
import { getRandomNotificationDetails } from '../fixtures/notification-details.fixture';

export const insertRandomNotificationDetails = async (
  userId: string,
  notificationDetailsOverride: Partial<NotificationDetailsRecord> = {},
): Promise<NotificationDetailsRecord> => {
  const [record] = await notificationDetailsRepository()
    .insert(getRandomNotificationDetails(userId, notificationDetailsOverride))
    .returning<NotificationDetailsRecord[]>('*');
  return record;
};
