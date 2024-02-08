import { Type } from '@sinclair/typebox';
import { extendResourceObject } from '@lib/db';
import { nullable } from '@lib/schemas';

export const userDtoSchema = extendResourceObject(
  Type.Object({
    phone_number: nullable(Type.String()),
  }),
  { $id: 'User' },
);
