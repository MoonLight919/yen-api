import { ApiBaseHttpException } from './api-base.http-exception';

export class BadRequestHttpException extends ApiBaseHttpException {
  public code = 'bad_request';
  public status = 400;
  constructor(message?: string) {
    super(message || 'Invalid request parameters');
  }
}
