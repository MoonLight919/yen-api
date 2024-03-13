import { type ID, type ResourceObject } from '@lib/db';

export interface UserRecord extends ResourceObject {
  sub: string;
  phone_number: string;
  signup_city: string;
  signup_country: string;
  signup_latitude: number;
  signup_longitude: number;
}

export interface IUserRecordResource extends ResourceObject {
  user: ID;
}
