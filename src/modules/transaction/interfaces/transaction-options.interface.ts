import { type Knex } from 'knex';
import { type EventBusTransaction } from '@modules/cqrs';

export interface TransactionOptions {
  knexTrx?: Knex.Transaction;
  eventBusTrx?: EventBusTransaction;
}
