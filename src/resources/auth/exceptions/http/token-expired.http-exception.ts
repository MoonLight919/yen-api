import { AuthenticationBaseHttpException } from './authentication-base.http-exception';

export class TokenExpiredHttpException extends AuthenticationBaseHttpException {
  public status = 401;
}
