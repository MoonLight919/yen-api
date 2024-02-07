import { ApiBaseHttpException } from './api-base.http-exception';

export class ServerUnavailableHttpException extends ApiBaseHttpException {
  public code = 'server_unavailable_exception';
  public status = 503;

  constructor(message?: string) {
    super(message ?? 'Server unavailable');
  }
}
