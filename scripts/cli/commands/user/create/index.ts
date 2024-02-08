import { ArgumentsCamelCase, Argv } from 'yargs';
import { faker } from '@faker-js/faker';
import { userRepository } from '../../../repositories';
import { wrapper } from '../../../providers';
import { ID } from '@lib/db';

export interface CreateUserCommandOptions {
  id?: ID;
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export const command = 'create';
export const desc = 'Create user in the database';

export const builder = (yargs: Argv) => {
  yargs.option('id', {
    describe:
      'ID of database user. If specified will use existing, if not specified will create new one. Examples "usr_asfds2sdfas"',
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

export const handler = wrapper(
  async (argv: ArgumentsCamelCase<CreateUserCommandOptions>): Promise<void> => {
    const [createdUser] = await userRepository
      .insert({
        id: argv.id,
        sub: argv.sub ?? `auth0|${faker.database.mongodbObjectId()}`,
        phone_number: argv.phoneNumber ?? faker.phone.number(),
      })
      .returning('*');
    console.log(createdUser);
  },
);
