import { BaseHttpException } from '../../base.http-exception';

export abstract class ApiBaseHttpException extends BaseHttpException {
  public type = 'api_error';
}
