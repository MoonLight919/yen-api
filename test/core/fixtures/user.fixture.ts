import { faker } from '@faker-js/faker';
import { type UserRecord } from '@resources/user/interfaces';
import { now } from '@utils';

export const getRandomUser = (
  userOverride: Partial<UserRecord> = {},
): UserRecord => ({
  id: faker.string.uuid(),
  created_at: now(),
  updated_at: now(),
  deleted_at: null,
  sub: null,
  phone_number: faker.phone.number(),
  ...userOverride,
});
