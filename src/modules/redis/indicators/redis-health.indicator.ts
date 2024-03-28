import {
  HealthIndicator,
  type HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  REDIS_BCLIENT,
  REDIS_CLIENT,
  REDIS_SUBSCRIBER,
} from '../redis.constants';

export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(REDIS_CLIENT) private readonly _redisClient: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly _redisSubscriber: Redis,
    @Inject(REDIS_BCLIENT) private readonly _redisBClient: Redis,
  ) {
    super();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await Promise.all([
        this._redisClient.ping(),
        this._redisSubscriber.ping(),
        this._redisBClient.ping(),
      ]);
      return this.getStatus('redis', true);
    } catch (err) {
      throw new HealthCheckError(
        'Redis is not healthy',
        this.getStatus('redis', false),
      );
    }
  }
}
