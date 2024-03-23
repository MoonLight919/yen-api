import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { auth0Config as a0c } from '@config/auth0.config';
import { UserService } from '@resources/user/services';
import { type UserRecord } from '@resources/user/interfaces';
import {
  type Auth0AuthorisationBodyDto,
  type Auth0EventPostUserRegistrationBodyDto,
} from '../schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @Inject(a0c.KEY)
    private readonly auth0Config: ConfigType<typeof a0c>,
  ) {}

  public async authorize(
    auth0AuthorisationBodyDto: Auth0AuthorisationBodyDto,
  ): Promise<string> {
    const response = await this.httpService
      .post(
        `${this.auth0Config.domain as string}/oauth/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.auth0Config.client_id as string,
          client_secret: this.auth0Config.client_secret as string,
          code: auth0AuthorisationBodyDto.code,
          redirect_uri: this.auth0Config.redirect_url as string,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .toPromise();

    if (!response) {
      throw new Error(`Post request to ${this.auth0Config.domain} failed`);
    }

    return response.data.access_token;
  }

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
