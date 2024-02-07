import { type ID, type ResourceObject } from '@lib/db';
import { type Nullable } from '@lib/interfaces';

export interface UserRecord extends ResourceObject {
  sub: Nullable<string>;
  phone_number: Nullable<string>;
}

export interface IUserRecordResource extends ResourceObject {
  user: ID;
}
