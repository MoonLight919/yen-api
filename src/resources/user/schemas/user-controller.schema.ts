import { Type, type Static } from '@sinclair/typebox';

export const patchUserRequestBodyDtoSchema = Type.Object(
  {
    default_region: Type.Optional(Type.String()),
    current_region: Type.Optional(Type.String()),
  },
  { additionalProperties: false, $id: 'PatchUserRequestBodyDto' },
);
export type PatchUserRequestBodyDto = Static<
  typeof patchUserRequestBodyDtoSchema
>;
