import { Logger } from '@nestjs/common';
import { type Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';

export function handleRetry(
  name: string,
  retryAttempts = 9,
  retryDelay = 3000,
  verboseRetryLog = false,
  toRetry?: (err: unknown) => boolean,
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger(name);
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error: Error) => {
            if (toRetry && !toRetry(error)) {
              throw error;
            }
            const verboseMessage = verboseRetryLog
              ? ` Message: ${error.message}.`
              : '';

            logger.error(
              `Unable to connect to the ${name}.${verboseMessage} Retrying (${
                errorCount + 1
              })...`,
              error.stack,
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}
