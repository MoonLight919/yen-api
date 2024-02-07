import { UserBaseHttpException } from './user-base.http-exception';

export class UserPhoneNumberAlreadyExistsHttpException extends UserBaseHttpException {
  public status = 400;
}
