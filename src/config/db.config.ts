import { types } from 'pg';
import { registerAs, type ConfigType } from '@nestjs/config';
import { type Knex } from 'knex';
import { coerceStringToBoolean } from '@utils';

export const dbConfig = registerAs('db', () => {
  const connectionString = process.env.DATABASE_URL ?? '';
  const host = process.env.DATABASE_HOST ?? 'localhost';
  const port = +(process.env.DATABASE_PORT ?? 5432);
  const database = process.env.DATABASE_NAME ?? 'main';
  const user = process.env.DATABASE_USERNAME ?? 'postgres';
  const password = process.env.DATABASE_PASSWORD ?? 'example';
  const ssl =
    process.env.DATABASE_SSL_MODE || false
      ? { rejectUnauthorized: false }
      : false;

  let connectionOptions: Knex.PgConnectionConfig = {
    keepAlive: true,
  };
  if (connectionString) {
    connectionOptions = { ...connectionOptions, connectionString };
  } else {
    connectionOptions = {
      ...connectionOptions,
      host,
      port,
      user,
      password,
      database,
      ssl,
    };
  }

  types.setTypeParser(types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value);
  });

  return {
    connection: connectionOptions,
    pool: {
      min: 0,
      max: 10,
    },
    asyncStackTraces:
      coerceStringToBoolean(process.env.DATABASE_ASYNC_STACK_TRACES) ?? false,
  };
});

export type DBConfig = ConfigType<typeof dbConfig>;
