import { Type } from '@sinclair/typebox';
import { extendResourceObject } from '@lib/db';

export const userDtoSchema = extendResourceObject(
  Type.Object({
    phone_number: Type.String(),
    signup_city: Type.String(),
    signup_country: Type.String(),
    signup_latitude: Type.Number(),
    signup_longitude: Type.Number(),
  }),
  { $id: 'User' },
);
