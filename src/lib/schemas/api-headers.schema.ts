import { Type } from '@sinclair/typebox';

export const headersSchema = Type.Object(
  {
    'x-device-id': Type.Optional(Type.String()),
  },
  { $id: 'ApiHeaders' },
);
