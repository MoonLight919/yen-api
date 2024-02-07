import { ForbiddenError } from '@lib/errors';
import { AuthenticationBaseHttpException } from './authentication-base.http-exception';

export class ForbiddenHttpException extends AuthenticationBaseHttpException {
  public status = 403;

  constructor(message?: string) {
    super(new ForbiddenError(message));
  }
}
