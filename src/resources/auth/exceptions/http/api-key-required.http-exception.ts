import { AuthenticationBaseHttpException } from './authentication-base.http-exception';

export class ApiKeyRequiredHttpException extends AuthenticationBaseHttpException {
  code = 'api_key_required';
  status = 401;
  constructor(message?: string) {
    super(message ?? `API key is required`);
  }
}
