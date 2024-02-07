import { ValidationBaseHttpException } from './validation-base.http-exception';

export class ValidationHttpException extends ValidationBaseHttpException {
  code = 'validation_failed';
  status = 400;
  constructor(message?: string) {
    super(
      message ||
        `Some of provided values are invalid. Please fix them and try again`,
    );
  }
}
