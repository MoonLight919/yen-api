import { Injectable } from '@nestjs/common';
import { UserService } from '@resources/user/services';
import { type UserRecord } from '@resources/user/interfaces';
import type { Auth0EventPreUserRegistrationBodyDto } from '../schemas';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async postRegistration(
    auth0Event: Auth0EventPreUserRegistrationBodyDto,
  ): Promise<UserRecord | Error | void> {
    const existingUser = this.userService.retrieveBy({
      sub: auth0Event.user.user_id,
    });

    if (!existingUser) {
      const phoneNumber = auth0Event.user.user_id;
      if (!phoneNumber) {
        throw new Error('Phone number is not present');
      }

      return this.userService.create({
        phone_number: phoneNumber,
        sub: auth0Event.user.user_id as string,
      });
    }
  }
}
