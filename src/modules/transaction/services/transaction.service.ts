import { Injectable } from '@nestjs/common';
import { KnexionTransactionService } from '@knexion/core';
import { EventBusTransaction } from '@modules/cqrs';
import { type TransactionOptions } from '../interfaces';

@Injectable()
export class TransactionService {
  constructor(
    private readonly knexionTransactionService: KnexionTransactionService,
    private readonly _eventBusTransaction: EventBusTransaction,
  ) {}

  public async withTransaction<T>(
    cb: (transactionOptions: Required<TransactionOptions>) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T> {
    if (this.validateTransactionOptions(options)) {
      return cb(options);
    }
    const [knexTrx, eventBusTrx] = await Promise.all([
      this.knexionTransactionService.transaction(),
      this._eventBusTransaction.transaction(),
    ]);
    const trxOptions: Required<TransactionOptions> = {
      knexTrx,
      eventBusTrx,
    };
    try {
      const resultOrError = await cb(trxOptions);
      if (resultOrError instanceof Error) {
        await this.rollback(trxOptions, resultOrError);
        return resultOrError;
      }
      await this.commit(trxOptions, resultOrError);
      return resultOrError;
    } catch (err) {
      await this.rollback(trxOptions, err);
      throw err;
    }
  }

  public async commit(
    { knexTrx, eventBusTrx }: Required<TransactionOptions>,
    result: unknown,
  ): Promise<void> {
    if (!knexTrx.isCompleted()) {
      await knexTrx.commit(result);
    }
    if (eventBusTrx.isActive()) {
      await eventBusTrx.commit();
    }
  }

  public async rollback(
    { knexTrx, eventBusTrx }: Required<TransactionOptions>,
    err: Error | unknown,
  ): Promise<void> {
    await Promise.all([
      !knexTrx.isCompleted() && knexTrx.rollback(err),
      eventBusTrx.isActive() && eventBusTrx.abort(),
    ]);
  }

  private validateTransactionOptions(
    transactionOptions: TransactionOptions | undefined,
  ): transactionOptions is Required<TransactionOptions> {
    if (!transactionOptions) {
      return false;
    }
    if (transactionOptions.knexTrx && !transactionOptions.eventBusTrx) {
      throw new Error(
        'Invalid transaction options. Knex transaction is passed, but transaction container is undefined',
      );
    }
    if (transactionOptions.eventBusTrx && !transactionOptions.eventBusTrx) {
      throw new Error(
        'Invalid transaction options. Transaction container is passed, but knex transaction is undefined',
      );
    }
    return !!(transactionOptions.knexTrx && transactionOptions.eventBusTrx);
  }
}
