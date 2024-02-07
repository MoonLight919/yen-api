import { Type } from '@sinclair/typebox';
import { extendResourceObject, idSchema } from '@lib/db';
import { nullable, ref } from '@lib/schemas';

export const userDtoSchema = extendResourceObject(
  Type.Object({
    phone_number: nullable(Type.String()),
  }),
  { $id: 'User' },
);
