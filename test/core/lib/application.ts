import { type IncomingMessage } from 'node:http';
import { randomUUID } from 'crypto';
import { parse as qsParse } from 'qs';
import { type ModuleMetadata, Logger } from '@nestjs/common';
import { type FastifyInstance } from 'fastify';
import * as Sentry from '@sentry/node';
import { Test, type TestingModuleBuilder } from '@nestjs/testing';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationModule } from 'nestjs-validation';
import { KnexionModule } from '@knexion/core';
import { CoreModule } from '@modules/core/core.module';
import { CqrsModule } from '@modules/cqrs/cqrs.module';
import { MetadataContainer } from '@modules/core/metadata';
import { type ApplicationFastifyRequest } from '@modules/core/interfaces';
import { ConfigModule } from '@modules/config/config.module';
import { JwtService } from '@resources/auth/services';
import { TransactionModule } from '@modules/transaction';
import { dbConfig, type DBConfig } from '@config/db.config';
import { AjvResolverModule } from '@modules/ajv-resolver';
import { AuthCoreModule } from '@resources/auth/auth-core.module';
import { mockConfig, MockLoggerService, MockJwtService } from '../mocks';
import { initSentry } from '../../../src/sentry';

initSentry();

export const buildApplication = async (
  metadata: ModuleMetadata,
  config?: Record<string, unknown>,
  beforeCompile?: (
    app: TestingModuleBuilder,
  ) => TestingModuleBuilder | Promise<TestingModuleBuilder>,
): Promise<NestFastifyApplication> => {
  let appModule = Test.createTestingModule({
    ...metadata,
    imports: [
      KnexionModule.forRootAsync({
        useFactory: (config: DBConfig) => ({
          client: 'pg',
          connection: config.connection,
          pool: config.pool,
          asyncStackTraces: true,
        }),
        inject: [dbConfig.KEY],
      }),
      CqrsModule.forRoot(),
      ConfigModule,
      ValidationModule.forRoot(),
      CoreModule,
      AjvResolverModule,
      TransactionModule,
      AuthCoreModule,
      ...(metadata.imports || []),
    ],
  });

  await mockConfig(appModule, config);
  appModule.overrideProvider(Logger).useClass(MockLoggerService);
  appModule.overrideProvider(JwtService).useClass(MockJwtService);
  if (beforeCompile) {
    appModule = await beforeCompile(appModule);
  }

  const compiledApp = await appModule.compile();
  const app = compiledApp.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter({
      disableRequestLogging: true,
      genReqId: () => randomUUID(),
      querystringParser: (s) => qsParse(s),
    }),
  );

  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;
  fastify.addHook('onRequest', (req, _, done) => {
    const transactionName = `${req.routeOptions.method ?? req.method} ${
      req.routeOptions.url ?? req.url
    }`;
    const transaction = Sentry.startTransaction(
      {
        op: 'http.server',
        name: transactionName,
      },
      {
        request: {
          headers: req.headers,
          query: req.query,
          params: req.params,
          method: req.method,
          url: req.url,
          body: req.body,
        },
      },
    );
    const sentryScope = new Sentry.Scope();
    sentryScope.setSpan(transaction);
    (req.raw as IncomingMessage & { traceId: string }).traceId =
      transaction.traceId;
    (req as unknown as ApplicationFastifyRequest).sentryScope = sentryScope;
    (req as unknown as ApplicationFastifyRequest).metadata =
      new MetadataContainer(transaction.traceId, transaction.toTraceparent());
    done();
  });
  await app.init();
  return app;
};
