import { ApiBaseHttpException } from '@lib/exceptions/api/http/api-base.http-exception';

export class UnsupportedMediaTypeHttpException extends ApiBaseHttpException {
  public code = 'unsupported_media_type';
  public status = 415;
  constructor(message = 'Unsupported Media Type') {
    super(message);
  }
}
