import { faker } from '@faker-js/faker';
import { now } from '@utils';
import { type NotificationDetailsRecord } from '@resources/notifications/contracts';
import { NotificationTypes } from '@resources/notifications/notifications.constants';

export const getRandomNotificationDetails = (
  userId: string,
  notificationDetailsOverride: Partial<NotificationDetailsRecord> = {},
): NotificationDetailsRecord => ({
  id: faker.string.uuid(),
  created_at: now(),
  updated_at: now(),
  deleted_at: null,
  user: userId,
  type: NotificationTypes.AIR_QUALITY,
  trigger_value: faker.number.int(),
  lower_border: faker.number.int(),
  upper_border: faker.number.int(),
  upper_border_active: faker.datatype.boolean(),
  lower_border_active: faker.datatype.boolean(),
  default_location: faker.datatype.boolean(),
  active: faker.datatype.boolean(),
  alert_in_progress: faker.datatype.boolean(),
  ...notificationDetailsOverride,
});
