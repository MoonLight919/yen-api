import { type ID, type ResourceObject } from '@lib/db';
import { type Nullable } from '@lib/interfaces';

export interface UserRecord extends ResourceObject {
  sub: string;
  phone_number: string;
  signup_city: string;
  signup_country: string;
  signup_latitude: number;
  signup_longitude: number;
  default_region: Nullable<string>;
  current_region: Nullable<string>;
}

export interface IUserRecordResource extends ResourceObject {
  user: ID;
}
