import { Injectable } from '@nestjs/common';
import { UserService } from '@resources/user/services';
import { type UserRecord } from '@resources/user/interfaces';
import { type Auth0EventPostUserRegistrationBodyDto } from '../schemas';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async postRegistration(
    auth0Event: Auth0EventPostUserRegistrationBodyDto,
  ): Promise<UserRecord | Error | void> {
    const existingUser = await this.userService.retrieveBy({
      sub: auth0Event.user.user_id,
    });

    if (!existingUser) {
      const phoneNumber = auth0Event.user.phoneNumber;
      if (!phoneNumber) {
        throw new Error('Phone number is not present');
      }

      return this.userService.create({
        phone_number: phoneNumber,
        sub: auth0Event.user.user_id as string,
        signup_city: auth0Event.request.geoip!.cityName as string,
        signup_country: auth0Event.request.geoip!.countryName as string,
        signup_latitude: auth0Event.request.geoip!.latitude as number,
        signup_longitude: auth0Event.request.geoip!.longitude as number,
      });
    }
  }
}
