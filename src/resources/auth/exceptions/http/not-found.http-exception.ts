import { NotFoundError } from '@lib/errors';
import { AuthenticationBaseHttpException } from './authentication-base.http-exception';

export class NotFoundHttpException extends AuthenticationBaseHttpException {
  public status = 404;

  constructor(message?: string) {
    super(new NotFoundError(message));
  }
}
