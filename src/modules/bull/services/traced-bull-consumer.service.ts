import { Injectable, Logger } from '@nestjs/common';
import {
  Scope,
  type User,
  startTransaction,
  captureException as sentryCaptureException,
} from '@sentry/node';

@Injectable()
export class TracedBullConsumerService {
  private readonly op: string = 'bull.consumer';
  private readonly logger = new Logger(TracedBullConsumerService.name);

  private SCOPES = new Map<string | number, Scope>();

  public startSentryTransaction(
    jobId: string | number,
    user: User,
    metadata: object = {},
  ): string {
    const transactionName = `${this.op}:${jobId}`;
    const transaction = startTransaction({
      op: this.op,
      name: transactionName,
      metadata,
    });
    const sentryScope = new Scope();
    sentryScope.setSpan(transaction);
    sentryScope.setUser(user);
    this.SCOPES.set(jobId, sentryScope);
    return transaction.traceId;
  }

  public endSentryTransaction(
    jobId: string | number,
    status: string = 'completed',
  ): void {
    const scope = this.getScope(jobId);
    if (!scope) {
      this.logger.error({
        msg: `can't end transaction, no scope found for job`,
        job_id: jobId,
        status,
      });
      return;
    }
    this.finishTransaction(jobId, scope, status);
  }

  public captureException(
    jobId: string | number,
    error: Error,
    status: string = 'internal_error',
  ): void {
    const scope = this.getScope(jobId);
    if (!scope) {
      this.logger.error({
        msg: `can't capture exception, no scope found for job`,
        job_id: jobId,
        status,
        error: error.message,
      });
      return;
    }
    sentryCaptureException(error, () => scope);
    this.finishTransaction(jobId, scope, status);
  }

  public captureQueueException(
    error: Error,
    status: string = 'queue_error',
  ): void {
    const scope = new Scope();
    scope.setTag('status', status);
    sentryCaptureException(error, () => scope);
  }

  public getTraceId(jobId: string | number): string | null {
    const scope = this.getScope(jobId);
    if (!scope) {
      return null;
    }
    const transaction = scope.getTransaction();
    return transaction?.traceId ?? null;
  }

  private getScope(jobId: string | number): Scope | null {
    return this.SCOPES.get(jobId) ?? null;
  }

  private deleteScope(jobId: string | number): void {
    this.SCOPES.delete(jobId);
  }

  private finishTransaction(
    jobId: string | number,
    scope: Scope,
    status: string,
  ): void {
    const transaction = scope.getTransaction();
    if (transaction) {
      transaction.setStatus(status);
      transaction.finish();
    }
    this.deleteScope(jobId);
  }
}
