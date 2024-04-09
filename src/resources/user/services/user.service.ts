import { Injectable } from '@nestjs/common';
import { type SelectDatabaseOptions } from '@knexion/core';
import { TransactionService } from '@modules/transaction';
import {
  type ID,
  type List,
  type ListSelectDatabaseOptions,
  type OmitDefaultResourceFields,
} from '@lib/db';
import { type ServiceOptions } from '@lib/interfaces';
import { UserPhoneNumberAlreadyExistsError } from '../errors';
import { type UserRecord, type UserSignUpPayload } from '../interfaces';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionService: TransactionService,
  ) {}

  public async list<T extends UserRecord>(
    options?: ListSelectDatabaseOptions<UserRecord, T>,
  ): Promise<List<T>> {
    return this.userRepository.list(options);
  }

  public async create(
    user: UserSignUpPayload,
    options?: ServiceOptions<UserRecord, UserRecord>,
  ): Promise<UserRecord | Error> {
    return this.transactionService.withTransaction(async (trx) => {
      try {
        return await this.userRepository.create(
          {
            ...user,
            default_region: null,
            current_region: null,
            current_city: null,
            current_longitude: null,
            current_country: null,
            current_latitude: null,
            default_location_for_radiation_level_notifications: true,
            default_location_for_alerts_in_ua_notifications: true,
            default_location_for_air_quality_and_weather_notifications: true,
          },
          {
            intercept: options?.intercept,
            transaction: trx.knexTrx,
          },
        );
      } catch (err) {
        if (err instanceof UserPhoneNumberAlreadyExistsError) {
          return err;
        }
        throw err;
      }
    }, options);
  }

  public async retrieveBy<T extends UserRecord>(
    filters: Partial<UserRecord>,
    options: SelectDatabaseOptions<UserRecord, T> = {},
  ): Promise<T | null> {
    const {
      data: [user],
    } = await this.userRepository.list<T>({
      ...options,
      filter: filters,
      limit: 1,
    });
    return user ?? null;
  }

  public async retrieve<T extends UserRecord>(
    idUser: ID,
    options?: SelectDatabaseOptions<UserRecord, T>,
  ): Promise<T | null> {
    return this.userRepository.retrieve(idUser, options);
  }

  public async update(
    idUser: ID,
    updateUserPayload: Partial<OmitDefaultResourceFields<UserRecord>>,
    options?: ServiceOptions<UserRecord, UserRecord>,
  ): Promise<UserRecord | null> {
    return this.transactionService.withTransaction(async (trx) => {
      const previousUser = await this.retrieve(idUser, trx);
      if (!previousUser) {
        return null;
      }
      const updatedUser = await this.userRepository.update(
        idUser,
        updateUserPayload,
        {
          transaction: trx.knexTrx,
          intercept: options?.intercept,
        },
      );
      if (!updatedUser) {
        return null;
      }

      return updatedUser;
    }, options);
  }

  public async delete(
    idUser: ID,
    options?: ServiceOptions<UserRecord, UserRecord>,
  ): Promise<UserRecord | null> {
    const deletedUser = await this.userRepository.delete(idUser, {
      intercept: options?.intercept,
    });
    if (!deletedUser) {
      return null;
    }

    return deletedUser;
  }
}
