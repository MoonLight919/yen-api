import { type SelectDatabaseOptions } from '@knexion/core';
import { type FilterObject, type TimestampFilter } from '@knexion/filter';
import { type ListPaginationSelectDatabaseOptions } from '@knexion/cursor-pagination';

export interface ListSelectDatabaseOptions<TRecord, TResult>
  extends SelectDatabaseOptions<TRecord, TResult>,
    ListPaginationSelectDatabaseOptions<TRecord, TResult> {
  filter?: FilterObject<TRecord>;
  sort?: string[];
  created_at?: TimestampFilter;
}
