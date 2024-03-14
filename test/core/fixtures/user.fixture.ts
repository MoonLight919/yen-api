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
  sub: faker.string.uuid(),
  phone_number: faker.phone.number(),
  signup_city: faker.location.city(),
  signup_country: faker.location.country(),
  signup_latitude: faker.location.latitude(),
  signup_longitude: faker.location.longitude(),
  ...userOverride,
});
