/* eslint-disable @typescript-eslint/member-ordering */
import {
  type DefaultRepositoryOptions,
  Repository as KnexionRepository,
  UseKnexionInterceptors,
  type TakeField,
  DatabaseOptions,
  SelectDatabaseOptions,
} from '@knexion/core';
import { FilterInterceptor, FilterTimestampInterceptor } from '@knexion/filter';
import { SortInterceptor } from '@knexion/sort';
import { FilterSoftDeletedInterceptor } from '@knexion/soft-delete';
import { CursorPaginationInterceptor } from '@knexion/cursor-pagination';
import { now } from '@utils';
import type { ResourceObject, List } from './schemas';
import { ID } from './schemas';
import {
  ListSelectDatabaseOptions,
  type DefaultResourceFields,
  ListAutoPagination,
  type AutoPaginationMethods,
} from './interfaces';

type RepositoryOptions = {
  idType: ID;
  omitCreateFields: DefaultResourceFields;
  omitUpdateFields: DefaultResourceFields;
};

interface PromiseCache<R> {
  currentPromise: Promise<IteratorResult<R>> | undefined | null;
}

class ListIterator<
  TRecord extends ResourceObject,
  TResult extends ResourceObject,
> implements AsyncIterator<TResult>
{
  private index: number;
  private pagePromise: Promise<List<TResult>>;
  private promiseCache: PromiseCache<TResult> = { currentPromise: null };

  constructor(
    private readonly makeRequest: (
      options?: ListSelectDatabaseOptions<TRecord, List<TResult>>,
    ) => Promise<List<TResult>>,
    firstPagePromise: Promise<List<TResult>>,
    private readonly options?: ListSelectDatabaseOptions<
      TRecord,
      List<TResult>
    >,
  ) {
    this.index = 0;
    this.pagePromise = firstPagePromise;
  }

  public async iterate(
    pageResult: List<TResult>,
  ): Promise<IteratorResult<TResult>> {
    if (!(pageResult && pageResult.data && Array.isArray(pageResult.data))) {
      throw Error(
        'Unexpected: Response does not have a well-formed `data` array.',
      );
    }

    const reverseIteration = !!this.options?.page_before;
    if (this.index < pageResult.data.length) {
      const idx = reverseIteration
        ? pageResult.data.length - 1 - this.index
        : this.index;
      const value = pageResult.data[idx];
      this.index += 1;

      return { value, done: false };
    } else if (pageResult.has_more_next) {
      // Reset counter, request next page, and recurse.
      this.index = 0;
      this.pagePromise = this.getNextPage(pageResult);
      const nextPageResult = await this.pagePromise;
      return this.iterate(nextPageResult);
    }

    return { done: true, value: undefined };
  }

  public getNextPage(pageResult: List<TResult>): Promise<List<TResult>> {
    const isReverseIteration = !!this.options?.page_before;
    return this.makeRequest({
      ...this.options,
      page_after: !isReverseIteration
        ? this.encodePageInfo(
            pageResult.data[pageResult.data.length - 1],
            this.options?.sort ?? [],
          )
        : undefined,
      page_before: isReverseIteration
        ? this.encodePageInfo(pageResult.data[0], this.options?.sort ?? [])
        : undefined,
    });
  }

  public next(): Promise<IteratorResult<TResult>> {
    /**
     * If a user calls `.next()` multiple times in parallel,
     * return the same result until something has resolved
     * to prevent page-turning race conditions.
     */
    if (this.promiseCache.currentPromise) {
      return this.promiseCache.currentPromise;
    }

    const nextPromise = (async (): Promise<IteratorResult<TResult>> => {
      const ret = await this._next();
      this.promiseCache.currentPromise = null;
      return ret;
    })();

    this.promiseCache.currentPromise = nextPromise;

    return nextPromise;
  }

  private async _next(): Promise<IteratorResult<TResult>> {
    return this.iterate(await this.pagePromise);
  }

  private encodePageInfo(resource: TResult, sort: string[]) {
    return btoa(
      JSON.stringify({
        id: resource.id,
        created_at: resource.created_at,
        ...Object.fromEntries(
          sort.map((sortModel) => {
            const name = this.extractResourceFieldFromSortModel(sortModel);
            return [name, resource[name as keyof typeof resource]];
          }),
        ),
      }),
    );
  }

  private extractResourceFieldFromSortModel(sortModel: string) {
    const sortSymbol = sortModel[0];
    if (['+', '-'].includes(sortSymbol)) {
      return sortModel.slice(1, sortModel.length);
    }
    return sortModel;
  }
}

export class Repository<
  TRecord extends ResourceObject,
  Options extends DefaultRepositoryOptions = RepositoryOptions,
> extends KnexionRepository<TRecord, Options> {
  // @ts-expect-error interceptors overrides the result
  public list<TResult extends ResourceObject = TRecord>(
    ...args: unknown[]
  ): ListAutoPagination<TResult>;

  @UseKnexionInterceptors(
    new FilterTimestampInterceptor('created_at'),
    new SortInterceptor(),
    new FilterInterceptor(),
    new FilterSoftDeletedInterceptor(),
    new CursorPaginationInterceptor(),
  )
  // @ts-expect-error interceptors overrides the result
  public list<TResult extends ResourceObject = TRecord>(
    options?: ListSelectDatabaseOptions<TRecord, List<TResult>>,
  ): ListAutoPagination<TResult> {
    const listPromise = super.list<TResult, List<TResult>>(
      options as ListSelectDatabaseOptions<TRecord, TResult>,
    );
    Object.assign(
      listPromise,
      this.makeAutoPaginationMethods(listPromise, options),
    );
    return listPromise as ListAutoPagination<TResult>;
  }

  public async create(...args: unknown[]): Promise<TRecord>;
  @UseKnexionInterceptors()
  public async create(
    createPayload: Omit<TRecord, TakeField<Options, 'omitCreateFields'>>,
    options?: DatabaseOptions<TRecord, TRecord>,
  ): Promise<TRecord> {
    return super.create(createPayload, options);
  }

  public async retrieve<TResult = TRecord>(
    ...args: unknown[]
  ): Promise<TResult | null>;

  @UseKnexionInterceptors(new FilterSoftDeletedInterceptor())
  public async retrieve<TResult = TRecord>(
    id: ID,
    options?: SelectDatabaseOptions<TRecord, TResult>,
  ): Promise<TResult | null> {
    return super.retrieve<TResult>(id, options);
  }

  public async update(...args: unknown[]): Promise<TRecord | null>;
  @UseKnexionInterceptors(new FilterSoftDeletedInterceptor())
  public async update(
    id: ID,
    updatePayload: Partial<
      Omit<TRecord, TakeField<Options, 'omitUpdateFields'>>
    >,
    options?: DatabaseOptions<TRecord, TRecord>,
  ): Promise<TRecord | null> {
    return super.update(id, updatePayload, options);
  }

  public async delete(...args: unknown[]): Promise<TRecord | null>;
  @UseKnexionInterceptors(new FilterSoftDeletedInterceptor())
  public async delete(
    id: ID,
    options?: DatabaseOptions<TRecord, TRecord>,
  ): Promise<TRecord | null> {
    const [record] = await this.createQueryRunner<unknown, TRecord[]>(
      this.queryBuilder<TRecord>()
        .where('id', id)
        .update('deleted_at', now())
        .returning('*'),
      options,
      [id],
      this.delete,
    );
    if (!record) {
      return null;
    }
    return record;
  }

  private makeAutoPaginationMethods<TResult extends ResourceObject = TRecord>(
    listPromise: Promise<List<TResult>>,
    options?: ListSelectDatabaseOptions<TRecord, List<TResult>>,
  ): AutoPaginationMethods<TResult> {
    const iterator = new ListIterator<TRecord, TResult>(
      (options) => super.list(options),
      listPromise,
      options,
    );
    const autoPaginationMethods: AutoPaginationMethods<TResult> = {
      next: () => iterator.next(),
      [Symbol.asyncIterator]: () => autoPaginationMethods,
    };
    return autoPaginationMethods;
  }
}
