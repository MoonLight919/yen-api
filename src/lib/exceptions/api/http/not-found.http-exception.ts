import { ApiBaseHttpException } from './api-base.http-exception';

export class NotFoundHttpException extends ApiBaseHttpException {
  public code = 'not_found';
  public status = 404;

  constructor(message?: string) {
    super(
      message ||
        'The ID provided is not valid. Either the resource does not exist, or an ID for a different resource has been provided.',
    );
  }
}
