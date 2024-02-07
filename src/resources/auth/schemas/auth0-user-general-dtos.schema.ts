import { Type } from '@sinclair/typebox';

export const auth0UserIdentity = Type.Object(
  {
    connection: Type.Optional(Type.String()),
    isSocial: Type.Optional(Type.Boolean()),
    profileData: Type.Optional(Type.Object({})),
    provider: Type.Optional(Type.String()),
    user_id: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
