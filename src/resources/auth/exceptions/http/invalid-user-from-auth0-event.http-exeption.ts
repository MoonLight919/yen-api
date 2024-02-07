import { AuthenticationBaseHttpException } from './authentication-base.http-exception';

export class InvalidUserFromAuth0EventException extends AuthenticationBaseHttpException {
  public status = 400;
}
