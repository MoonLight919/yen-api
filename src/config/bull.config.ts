import { registerAs } from '@nestjs/config';

export const bullConfig = registerAs('bull', () => ({
  limiter: {
    max: 5, // Max number of jobs processed
    duration: 5000, // per duration in milliseconds
    bounceBack: false, // When jobs get rate limited, they stay in the waiting queue and are not moved to the delayed queue
  },
  prefix: 'bull', // prefix for all queue keys
  settings: {
    lockDuration: 30000, // Key expiration time for job locks.
    lockRenewTime: 15000, // Interval on which to acquire the job lock
    stalledInterval: 30000, // How often check for stalled jobs (use 0 for never checking).
    maxStalledCount: 1, // Max amount of times a stalled job will be re-processed.
    guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
    retryProcessDelay: 5000, // delay before processing next job in case of internal error.
    backoffStrategies: {}, // A set of custom backoff strategies keyed by name.
    drainDelay: 5, // A timeout for when the queue is in drained state (empty waiting for jobs).
  },
}));
