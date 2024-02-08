import { ArgumentsCamelCase, Argv } from 'yargs';
import { faker } from '@faker-js/faker';
import { CreateAuth0UserCommandOptions } from './interfaces';
import { GetUsers200ResponseOneOfInner, UserCreate } from 'auth0';
import { createAuth0User, getAuth0User } from '../../../services';
import { UserRecord } from '../../../../../src/app/user/interfaces';
import { userRepository } from '../../../repositories';
import { wrapper } from '../../../providers';

export const command = 'create-user';
export const desc = 'Create user in Auth0 and save into the database';

export const builder = (yargs: Argv) => {
  yargs.option('idUser', {
    describe:
      'ID of database user. If specified will use existing, if not specified will create new one. Examples "usr_"',
    type: 'string',
  });
  yargs.option('sub', {
    describe:
      'ID of Auth0 user. If specified will use existing, if not specified will create new one. Examples "auth0|622734069fd74900700205dc"',
    type: 'string',
  });
  yargs.option('email', {
    alias: 'e',
    describe: 'Email for the new user',
    type: 'string',
  });
  yargs.option('firstName', {
    alias: ['f', 'fn'],
    describe: 'First name for the new user',
    type: 'string',
  });
  yargs.option('lastName', {
    alias: ['l', 'ln'],
    describe: 'First name for the new user',
    type: 'string',
  });
};

const getOrCreateAuth0User = async (
  idAuth0?: string,
  userData: Omit<UserCreate, 'connection'> = {},
): Promise<GetUsers200ResponseOneOfInner | null> => {
  if (idAuth0) {
    return getAuth0User(idAuth0);
  }
  return createAuth0User({
    ...userData,
    email: userData.email ?? faker.internet.email(),
    family_name: userData.family_name ?? faker.name.lastName(),
    given_name: userData.given_name ?? faker.name.firstName(),
  });
};

const updateOrCreateDatabaseUser = async (
  id?: string,
  createUserPayload: Partial<
    Pick<UserRecord, 'email' | 'first_name' | 'last_name' | 'sub'>
  > = {},
): Promise<UserRecord | null> => {
  if (id) {
    const [user] = await userRepository
      .where('id', id)
      .update(createUserPayload)
      .returning('*');
    return user ?? null;
  }
  const [createdUser] = await userRepository
    .insert(createUserPayload)
    .returning('*');
  return createdUser;
};

export const handler = wrapper(
  async (
    argv: ArgumentsCamelCase<CreateAuth0UserCommandOptions>,
  ): Promise<void> => {
    const firstName = argv.firstName;
    const lastName = argv.lastName;
    const email = argv.email;
    const password = 'test12345678';

    const auth0User = await getOrCreateAuth0User(argv.sub, {
      email,
      given_name: firstName,
      family_name: lastName,
      password,
      name: `${firstName} ${lastName}`,
      email_verified: true,
      verify_email: false,
    });

    if (!auth0User) {
      throw new Error(`Couldn't find or create new auth0 user`);
    }

    console.log('Auth0 user', {
      ...auth0User,
      password,
    });

    const databaseUser = await updateOrCreateDatabaseUser(argv.idUser, {
      email: auth0User.email,
      first_name: auth0User.given_name,
      last_name: auth0User.family_name,
      sub: auth0User.user_id,
    });

    if (!databaseUser) {
      throw new Error(`Couldn't find or create new database user`);
    }

    console.log('Database user', databaseUser);
  },
);
