import { type DatabaseOptions } from '@knexion/core';
import { type TransactionOptions } from '@modules/transaction';

export type ServiceOptions<TRecord, TResult> = Omit<
  DatabaseOptions<TRecord, TResult>,
  'transaction'
> &
  TransactionOptions;
