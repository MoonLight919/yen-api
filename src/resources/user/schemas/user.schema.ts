import { Type } from '@sinclair/typebox';
import { extendResourceObject } from '@lib/db';
import { nullable } from '@lib/schemas';

export const userDtoSchema = extendResourceObject(
  Type.Object({
    phone_number: Type.String(),
    signup_city: Type.String(),
    signup_country: Type.String(),
    signup_latitude: Type.Number(),
    signup_longitude: Type.Number(),
    default_region: nullable(Type.String()),
    current_region: nullable(Type.String()),
  }),
  { $id: 'User' },
);
