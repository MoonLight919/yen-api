import { registerAs } from '@nestjs/config';
import type { RedisOptions } from 'ioredis';

export interface RedisUrlConfigOptions extends RedisOptions {
  url: string;
}

export interface RedisHostConfigOptions extends RedisOptions {
  host: string;
  port: number;
}

export type RedisConfigOptions = RedisUrlConfigOptions | RedisHostConfigOptions;

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  host: process.env.REDIS_HOST ?? 'localhost',
  port: +(process.env.REDIS_PORT ?? 6379),
  db: +(process.env.REDIS_DB ?? 0),
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
}));
