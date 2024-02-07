import { faker } from '@faker-js/faker';
import {
  type Auth0EventLoginBodyDto,
  type Auth0EventPreUserRegistrationBodyDto,
  type Auth0EventUserDto,
} from '@resources/auth/schemas';
import { type HttpRequestOptions } from '../lib/http-request';

export const getRandomAuth0EventUser = (
  auth0RuleUserOverride: Partial<Auth0EventUserDto> = {},
): Auth0EventUserDto => ({
  app_metadata: {},
  created_at: new Date().toString(),
  email: faker.internet.email(),
  email_verified: true,
  family_name: faker.person.lastName(),
  given_name: faker.person.firstName(),
  identities: [],
  last_password_reset: new Date().toString(),
  multifactor: [],
  name: faker.person.fullName(),
  nickname: faker.person.fullName(),
  phone_number: faker.phone.number(),
  phone_verified: true,
  picture: faker.image.url(),
  updated_at: new Date().toString(),
  user_id: faker.lorem.word(),
  user_metadata: {},
  username: faker.internet.userName(),
  ...auth0RuleUserOverride,
});

export interface IPreUserRegistrationOptions {
  payload: Auth0EventPreUserRegistrationBodyDto;
}

export interface ISignupOptions {
  payload: Auth0EventLoginBodyDto;
}

export const getRandomSignUpRequestOptions = (
  userPayload: Partial<Auth0EventUserDto> = {},
  requestPayload: object = {},
): (IPreUserRegistrationOptions | ISignupOptions) & HttpRequestOptions => ({
  method: 'POST',
  payload: {
    connection: {
      id: faker.lorem.word(),
      strategy: faker.lorem.word(),
      name: faker.lorem.word(),
    },
    request: {
      body: {},
      geoip: {
        cityName: faker.location.city(),
        countryName: faker.location.country(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        timeZone: faker.location.timeZone(),
      },
      hostname: faker.internet.domainName(),
      ip: faker.internet.ip(),
      language: 'en,ru-RU;q=0.9,ru;q=0.8,en-US;q=0.7,uk;q=0.6',
      method: 'POST',
      query: {},
      user_agent: faker.internet.userAgent(),
      ...requestPayload,
    },
    tenant: {
      id: faker.lorem.word(),
    },
    user: {
      ...getRandomAuth0EventUser(),
      ...userPayload,
    },
  },
  headers: {
    'X-API-Key': 'test_integration',
    'content-type': 'application/json',
  },
});
