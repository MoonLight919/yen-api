import { type Redis } from 'ioredis';
import {
  BullModule as NestBullModule,
  type BullRootModuleOptions,
} from '@nestjs/bull';
import { type DynamicModule } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import {
  REDIS_BCLIENT,
  REDIS_CLIENT,
  REDIS_SUBSCRIBER,
} from '@modules/redis/redis.constants';
import { RedisModule } from '@modules/redis/redis.module';
import { bullConfig } from '@config/bull.config';
import { TracedBullConsumerService } from './services';

export class BullModule {
  static forRoot(): DynamicModule {
    const dynamicModule = NestBullModule.forRootAsync({
      imports: [RedisModule.forRoot()],
      useFactory: (
        config: ConfigType<typeof bullConfig>,
        redisClient: Redis,
        redisSubscriber: Redis,
        redisBClient: Redis,
      ) =>
        ({
          createClient: (type: 'client' | 'subscriber' | 'bclient') => {
            if (type === 'client') {
              return redisClient;
            }
            if (type === 'subscriber') {
              return redisSubscriber;
            }
            return redisBClient;
          },
          ...config,
        }) as BullRootModuleOptions,
      inject: [bullConfig.KEY, REDIS_CLIENT, REDIS_SUBSCRIBER, REDIS_BCLIENT],
    });
    return {
      ...dynamicModule,
      providers: [
        TracedBullConsumerService,
        ...(dynamicModule?.providers ?? []),
      ],
      exports: [TracedBullConsumerService, ...(dynamicModule?.exports ?? [])],
    };
  }
}
