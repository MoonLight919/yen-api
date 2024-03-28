import { defer, timeout } from 'rxjs';
import { Redis } from 'ioredis';
import {
  type DynamicModule,
  type FactoryProvider,
  Inject,
  type OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import {
  redisConfig,
  type RedisConfigOptions,
  type RedisHostConfigOptions,
  type RedisUrlConfigOptions,
} from '@config/redis.config';
import { handleRetry } from '@utils';
import { RedisHealthIndicator } from './indicators';
import {
  REDIS_BCLIENT,
  REDIS_CLIENT,
  REDIS_SUBSCRIBER,
} from './redis.constants';

export class RedisModule implements OnApplicationShutdown {
  static forRoot(): DynamicModule {
    const redisClientProvider = RedisModule.createRedisProvider(REDIS_CLIENT);
    const redisSubscriberProvider =
      RedisModule.createRedisProvider(REDIS_SUBSCRIBER);
    const redisBClientProvider = RedisModule.createRedisProvider(REDIS_BCLIENT);

    return {
      module: RedisModule,
      providers: [
        redisClientProvider,
        redisSubscriberProvider,
        redisBClientProvider,
        RedisHealthIndicator,
      ],
      exports: [
        redisClientProvider,
        redisSubscriberProvider,
        redisBClientProvider,
        RedisHealthIndicator,
      ],
    };
  }

  static createRedisProvider(provideToken: symbol): FactoryProvider {
    const logger = new Logger(RedisModule.name);
    return {
      provide: provideToken,
      inject: [redisConfig.KEY],
      useFactory: async (redisOptions: ConfigType<typeof redisConfig>) =>
        await defer(async () => {
          if (RedisModule.isRedisUrlConfigOptions(redisOptions)) {
            return RedisModule.connectWithUrl(logger, redisOptions);
          } else {
            return RedisModule.connectWithHost(logger, redisOptions);
          }
        })
          .pipe(timeout(2000), handleRetry(provideToken.toString(), logger))
          .toPromise(),
    };
  }

  static isRedisUrlConfigOptions(
    config: RedisConfigOptions,
  ): config is RedisUrlConfigOptions {
    return !!(config as RedisUrlConfigOptions).url;
  }

  static async connectWithUrl(
    logger: Logger,
    { url, ...options }: RedisUrlConfigOptions,
  ): Promise<Redis> {
    logger.log(
      `Connecting to redis ${RedisModule.hideStringCredentials(url)}...`,
    );
    const redis = new Redis(url, options);
    await redis.ping();
    return redis;
  }

  static hideStringCredentials(connectionString: string): string {
    return connectionString.replace(/\/\/.*@/, '//*****:*****@');
  }

  static async connectWithHost(
    logger: Logger,
    options: RedisHostConfigOptions,
  ): Promise<Redis> {
    logger.log(`Connecting to redis ${options.host}:${options.port}...`);
    const redis = new Redis(options);
    await redis.ping();
    return redis;
  }

  private readonly _logger = new Logger(RedisModule.name);
  constructor(
    @Inject(REDIS_CLIENT) private readonly _redisClient: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly _redisSubscriber: Redis,
    @Inject(REDIS_BCLIENT) private readonly _redisBClient: Redis,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled([
      this._redisClient.quit(),
      this._redisSubscriber.quit(),
      this._redisBClient.quit(),
    ]);
    this._logger.log(`Connection to redis is destroyed`);
  }
}
