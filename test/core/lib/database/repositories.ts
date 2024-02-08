import { type Knex } from 'knex';
import { type UserRecord } from '@resources/user/interfaces';
import { getKnexManager } from './knex';

export type EntityRepository<T extends {} = {}> = () => Knex.QueryBuilder<T>;

export const userRepository: EntityRepository<UserRecord> = () =>
  getKnexManager()('users');

export const clearAll = async (
  repositories?: EntityRepository[],
): Promise<void> => {
  if (!repositories) {
    repositories = [userRepository];
  }

  const tables_string = repositories
    .map((repository) => {
      const repo = repository() as unknown as { _single: { table: string } };
      return repo._single.table;
    })
    .join(',');

  await getKnexManager().raw(`truncate ${tables_string} cascade`);
};
