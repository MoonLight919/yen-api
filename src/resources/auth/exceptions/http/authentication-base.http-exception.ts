import { BaseHttpException } from '@lib/exceptions/base.http-exception';

export abstract class AuthenticationBaseHttpException extends BaseHttpException {
  public type = 'authentication_error';
}
