import * as Sentry from '@sentry/node';
import { type SamplingContext } from '@sentry/types';
import '@sentry/tracing';
import { readPackageJson } from '@utils';

const sentryEnvironment = process.env.SENTRY_ENVIRONMENT || 'local';

/*
 * Specify name of environments which should be disabled to send any transaction
 * */
const disabledEnvironments: string[] = [];

/*
 * Specify from 0 to 1 percent rate to each transaction name.
 * Where 0 is disabling all transactions and 1 send each transaction
 * */
const tracesSamplerMap: Record<string, number> = {
  'OPTIONS *': 0,
  'GET /v1/health/readiness': 0,
  'GET /v1/health/liveness': 0,
  'GET /v1/health/startup': 0,
};

/*
 * If transaction not specified in `tracesSamplerMap` object then standard percent rate will be applied
 * */
const defaultTraceSamplerRate = 0.03;

const mapTransactionToTraceSampler = (transactionName: string): number => {
  return tracesSamplerMap[transactionName] ?? defaultTraceSamplerRate;
};

export const initSentry = (): void => {
  Sentry.init({
    tracesSampler: (samplingContext: SamplingContext) => {
      if (disabledEnvironments.includes(sentryEnvironment)) {
        return 0;
      }
      return mapTransactionToTraceSampler(
        samplingContext.transactionContext.name,
      );
    },
    debug: false,
    sampleRate: 1.0,
    maxBreadcrumbs: 100,
    release: readPackageJson().version as string,
    environment: sentryEnvironment,
    normalizeDepth: 6,
  });
};
