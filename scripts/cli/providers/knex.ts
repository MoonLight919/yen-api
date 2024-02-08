import knex, { Knex } from 'knex';

let knexInstance: Knex;

export const getKnex = <TRecord extends {}, TResult extends {}>(): Knex<
  TRecord,
  TResult
> => {
  if (knexInstance) {
    return knexInstance as Knex<TRecord, TResult>;
  }
  knexInstance = knex({
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: +(process.env.DATABASE_PORT ?? 5432),
      user: process.env.DATABASE_USERNAME ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'example',
      database: process.env.DATABASE_NAME ?? 'main',
    },
  });
  return knexInstance as Knex<TRecord, TResult>;
};
