import { type EventBusTransaction } from '../lib';

export interface PublishOptions {
  transaction?: EventBusTransaction;
}
