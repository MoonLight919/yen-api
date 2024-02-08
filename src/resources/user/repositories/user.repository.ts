import {
  type DatabaseOptions,
  isPostgresError,
  KnexionRepository,
} from '@knexion/core';
import { type OmitDefaultResourceFields, Repository } from '@lib/db';
import { UserPhoneNumberAlreadyExistsError } from '../errors';
import { type UserRecord } from '../interfaces';

@KnexionRepository({ name: 'users' })
export class UserRepository extends Repository<UserRecord> {
  public async create(
    createUserPayload: OmitDefaultResourceFields<UserRecord>,
    options?: DatabaseOptions<UserRecord, UserRecord>,
  ): Promise<UserRecord> {
    try {
      return await super.create(createUserPayload, options);
    } catch (err) {
      if (isPostgresError(err)) {
        if (
          err.constraint === 'users_phone_number_unique' &&
          createUserPayload.phone_number
        ) {
          throw new UserPhoneNumberAlreadyExistsError(
            createUserPayload.phone_number,
          );
        }
      }
      throw err;
    }
  }
}
