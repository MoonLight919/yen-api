import { ApiBaseHttpException } from './api-base.http-exception';

export class ForbiddenHttpException extends ApiBaseHttpException {
  public code = 'forbidden';
  public status = 403;
  constructor(message?: string) {
    super(message || 'Forbidden action');
  }
}
