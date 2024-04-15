import { Type, type Static } from '@sinclair/typebox';

export const patchUserRequestBodyDtoSchema = Type.Object(
  {
    default_region: Type.Optional(Type.String()),
    current_region: Type.Optional(Type.String()),
    current_city: Type.Optional(Type.String()),
    current_country: Type.Optional(Type.String()),
    current_latitude: Type.Optional(Type.Number()),
    current_longitude: Type.Optional(Type.Number()),
  },
  { additionalProperties: false, $id: 'PatchUserRequestBodyDto' },
);
export type PatchUserRequestBodyDto = Static<
  typeof patchUserRequestBodyDtoSchema
>;
