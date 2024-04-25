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
  default_city: faker.location.city(),
  default_country: faker.location.country(),
  default_latitude: faker.location.latitude(),
  default_longitude: faker.location.longitude(),
  default_region: faker.location.state(),
  current_city: faker.location.city(),
  current_country: faker.location.country(),
  current_latitude: faker.location.latitude(),
  current_longitude: faker.location.longitude(),
  current_region: faker.location.state(),
  ...userOverride,
});
