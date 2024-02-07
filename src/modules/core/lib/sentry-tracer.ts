import { TRACEPARENT_REGEXP } from '@sentry/utils';

export interface ParentSentryTrace {
  traceId: string;
  parentSampled: boolean | undefined;
  parentSpanId: string;
}

export class SentryTracer {
  static extractParentTrace(sentryTrace: string): ParentSentryTrace {
    const matches = TRACEPARENT_REGEXP.exec(sentryTrace);
    if (!matches) {
      throw new Error('Invalid sentry trace');
    }
    return {
      traceId: matches[1],
      parentSampled: this.isSampled(matches),
      parentSpanId: matches[2],
    };
  }

  private static isSampled(matches: string[]): boolean | undefined {
    if (matches[3] === '1') {
      return true;
    } else if (matches[3] === '0') {
      return false;
    }
  }
}
