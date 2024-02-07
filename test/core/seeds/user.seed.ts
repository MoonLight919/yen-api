import { faker } from '@faker-js/faker';
import { type UserRecord } from '@resources/user/interfaces';
import { userRepository } from '../lib/database/repositories';
import { getMockJwt } from '../mocks';
import { getRandomUser } from '../fixtures';

export const insertRandomUser = async (
  userOverride: Partial<UserRecord> = {},
): Promise<UserRecord> => {
  const [record] = await userRepository()
    .insert(
      getRandomUser({
        id: undefined,
        ...userOverride,
      }),
    )
    .returning<UserRecord[]>('*');
  return record;
};

export const insertRandomUserWithAuth0Sub = async (
  userOverride: Partial<UserRecord> = {},
): Promise<{
  token: string;
  user: UserRecord;
}> => {
  const randomId = `auth0|${faker.string.uuid()}`;
  const [token, user] = await Promise.all([
    getMockJwt(randomId),
    insertRandomUser({ ...userOverride, sub: randomId }),
  ]);
  return {
    token,
    user,
  };
};

export const updateUser = async (
  id: string,
  userOverride: Partial<UserRecord>,
): Promise<UserRecord> => {
  const [record] = await userRepository()
    .update(userOverride)
    .where({ id })
    .returning<UserRecord[]>('*');
  return record;
};
