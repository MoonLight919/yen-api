import { ApiBaseHttpException } from './api-base.http-exception';

export class ServerHttpException extends ApiBaseHttpException {
  public code = 'server_exception';
  public status = 500;

  constructor(err: Error) {
    super(err.message);
  }
}
