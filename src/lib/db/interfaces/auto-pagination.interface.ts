import { type List } from '../schemas';

export interface AutoPaginationMethods<T> {
  next: () => Promise<IteratorResult<T>>;
  [Symbol.asyncIterator]: () => AutoPaginationMethods<T>;
}

export type ListAutoPagination<T> = Promise<List<T>> & AutoPaginationMethods<T>;
