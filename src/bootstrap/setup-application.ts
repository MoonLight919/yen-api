import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { type NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { parse as qsParse } from 'qs';
import cors from '@fastify/cors';
import { Logger } from 'nestjs-pino';
import { verifyNodeJSVersion } from '@utils';
import { featuresConfig, type FeaturesConfig } from '@config/features.config';
import { AppModule } from '../resources/app.module';

export const setupApplication = async (
  options: NestApplicationContextOptions = {},
): Promise<NestFastifyApplication> => {
  await verifyNodeJSVersion();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      disableRequestLogging: true,
      genReqId: () => randomUUID(),
      querystringParser: (s: string) => qsParse(s),
    }),
    {
      bufferLogs: true,
      ...options,
    },
  );
  if (options.logger !== false) {
    app.useLogger(app.get(Logger));
  }
  const allowedHeaders = [
    'Authorization',
    'Content-Type',
    'sentry-trace',
    'baggage',
    'idempotency-key',
    'X-API-Key',
  ];

  const fc = app.get<FeaturesConfig>(featuresConfig.KEY);

  if (!fc.auth) {
    allowedHeaders.push('dev-user-id');
  }

  await app.register(cors, {
    credentials: true,
    origin: true,
    allowedHeaders,
  });
  app.enableShutdownHooks();
  app.setGlobalPrefix('v1');

  return app;
};
