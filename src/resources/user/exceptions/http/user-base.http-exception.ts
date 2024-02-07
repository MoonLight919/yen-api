import { BaseHttpException } from '@lib/exceptions/base.http-exception';

export abstract class UserBaseHttpException extends BaseHttpException {
  public type = 'user_error';
}
