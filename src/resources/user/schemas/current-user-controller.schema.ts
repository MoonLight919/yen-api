import { Type, type Static } from '@sinclair/typebox';
import { ref } from '@lib/schemas';
import { userDtoSchema } from './user.schema';

export const retrieveCurrentUserResponseDtoSchema = Type.Object(
  {
    user: ref(userDtoSchema),
  },
  { additionalProperties: false, $id: 'RetrieveCurrentUserResponse' },
);
export type RetrieveCurrentUserResponseDto = Static<
  typeof retrieveCurrentUserResponseDtoSchema
>;

