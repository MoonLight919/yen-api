import { type IncomingMessage } from 'node:http';
import * as Sentry from '@sentry/node';
import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { type FastifyRequest } from 'fastify';
import { type FastifyAdapter } from '@nestjs/platform-fastify';
import { type ParentSentryTrace, SentryTracer } from '@modules/core/lib';
import { isString } from '@utils';
import { MetadataContainer } from '../metadata';
import { type ApplicationFastifyRequest } from '../interfaces';

@Injectable()
export class TracingProvider {
  constructor(private readonly httpAdapter: HttpAdapterHost<FastifyAdapter>) {
    if (!this.httpAdapter.httpAdapter) {
      return;
    }
    const fastify = this.httpAdapter.httpAdapter.getInstance();

    fastify.addHook('onRequest', (req, _, done) => {
      const parentTrace = this.extractParentTrace(req);
      const transactionName = this.extractTransactionName(
        req as unknown as FastifyRequest,
      );
      const transaction = Sentry.startTransaction(
        {
          op: 'http.server',
          name: transactionName,
          ...parentTrace,
        },
        { request: this.extractRequestData(req as unknown as FastifyRequest) },
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
    fastify.addHook('onResponse', (req, res, done) => {
      const scope = (req as unknown as ApplicationFastifyRequest).sentryScope;
      const transaction = scope.getTransaction();
      if (transaction) {
        transaction.setHttpStatus(res.statusCode);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          transaction.setStatus('ok');
        } else if (res.statusCode >= 500) {
          transaction.setStatus('internal_error');
        }
        transaction.finish();
      }
      done();
    });
  }

  private extractParentTrace(req: FastifyRequest): ParentSentryTrace | {} {
    const sentryTrace = req.headers['sentry-trace'];
    if (!isString(sentryTrace)) {
      return {};
    }
    return SentryTracer.extractParentTrace(sentryTrace);
  }

  private extractTransactionName(req: FastifyRequest): string {
    return `${req.routeOptions.method ?? req.method} ${
      req.routeOptions.url ?? req.url
    }`;
  }

  private extractRequestData(req: FastifyRequest): Record<string, unknown> {
    return {
      headers: req.headers,
      query: req.query,
      params: req.params,
      method: req.method,
      url: req.url,
      body: req.body,
    };
  }
}
