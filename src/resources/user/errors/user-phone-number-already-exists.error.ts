import { type BusinessError } from '@lib/interfaces';

export class UserPhoneNumberAlreadyExistsError
  extends Error
  implements BusinessError
{
  public code = 'user_phone_number_already_exists';
  constructor(phoneNumber?: string) {
    super(
      'User' +
        (phoneNumber ? ` with phone number "${phoneNumber}"` : '') +
        ' already exists',
    );
  }
}
