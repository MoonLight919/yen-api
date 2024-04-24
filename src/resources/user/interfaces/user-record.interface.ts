import { type ID, type ResourceObject } from '@lib/db';
import { type Nullable } from '@lib/interfaces';

export interface UserRecord extends ResourceObject {
  sub: string;
  phone_number: string;
  default_city: string;
  default_country: string;
  default_latitude: number;
  default_longitude: number;
  default_region: Nullable<string>;
  current_city: Nullable<string>;
  current_country: Nullable<string>;
  current_latitude: Nullable<number>;
  current_longitude: Nullable<number>;
  current_region: Nullable<string>;
}

export interface IUserRecordResource extends ResourceObject {
  user: ID;
}
