import { AuthenticationBaseHttpException } from './authentication-base.http-exception';

export class NotAuthenticatedRequestHttpException extends AuthenticationBaseHttpException {
  public status = 401;
}
