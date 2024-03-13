import { type Static, Type } from '@sinclair/typebox';
import { auth0UserIdentity } from './auth0-user-general-dtos.schema';

export const auth0EventUserDtoSchema = Type.Object(
  {
    app_metadata: Type.Optional(Type.Object({})),
    created_at: Type.Optional(Type.String()),
    email: Type.Optional(Type.String()),
    email_verified: Type.Optional(Type.Boolean()),
    family_name: Type.Optional(Type.String()),
    given_name: Type.Optional(Type.String()),
    identities: Type.Array(auth0UserIdentity),
    last_password_reset: Type.Optional(Type.String()),
    multifactor: Type.Optional(Type.Array(Type.String())),
    name: Type.Optional(Type.String()),
    nickname: Type.Optional(Type.String()),
    phoneNumber: Type.Optional(Type.String()),
    phone_verified: Type.Optional(Type.Boolean()),
    picture: Type.Optional(Type.String()),
    updated_at: Type.Optional(Type.String()),
    user_id: Type.Optional(Type.String()),
    user_metadata: Type.Optional(Type.Object({})),
    username: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export type Auth0EventUserDto = Static<typeof auth0EventUserDtoSchema>;
