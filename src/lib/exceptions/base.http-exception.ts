import { type BusinessError } from '@lib/interfaces/business-error';
import { isError, isString } from '@utils';

export abstract class BaseHttpException extends Error {
  public code: string;
  public abstract type: string;
  public abstract status: number;

  constructor(error: BusinessError | Error | string) {
    super(isString(error) ? error : error?.message || 'Unknown error');
    if (isError(error) && 'code' in error) {
      this.code = error.code;
    }
  }
}
