import { type Observable, type ObservedValueOf, from } from 'rxjs';
import { type AutoPaginationMethods, type ListAutoPagination } from '@lib/db';

export const fromListIterator = <T>(
  listRequest: ListAutoPagination<T>,
): Observable<ObservedValueOf<AutoPaginationMethods<T>>> =>
  from({
    next: listRequest.next,
    [Symbol.asyncIterator]: listRequest[Symbol.asyncIterator],
  });
