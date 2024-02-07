/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type LoggerService } from '@nestjs/common';

export class MockLoggerService implements LoggerService {
  error(message: unknown, trace?: string, context?: string): void {}
  log(message: unknown, context?: string): void {}
  warn(message: unknown, context?: string): void {}
  debug(message: unknown, context?: string): void {}
  verbose(message: unknown, context?: string): void {}
  public setContext(): void {}
  public injectLogger(): void {}
}
