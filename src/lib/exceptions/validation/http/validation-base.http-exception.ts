import { BaseHttpException } from '../../base.http-exception';

export abstract class ValidationBaseHttpException extends BaseHttpException {
  public type = 'validation_error';
}
