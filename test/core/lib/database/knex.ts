import knex, { type Knex } from 'knex';

export const generateDatabaseConnectionOptions =
  (): Knex.PgConnectionConfig => ({
    port: 5432,
    host: process.env.TEST_DATABASE_HOST || 'localhost',
    user: process.env.TEST_DATABASE_USERNAME || 'postgres',
    password: process.env.TEST_DATABASE_PASSWORD || 'example',
    database: process.env.TEST_DATABASE_NAME || 'test_integration',
  });

let knexInstance: Knex;

export const getKnexManager = (): Knex => {
  if (!knexInstance) {
    knexInstance = knex({
      client: 'pg',
      connection: generateDatabaseConnectionOptions(),
    });
  }
  return knexInstance;
};
