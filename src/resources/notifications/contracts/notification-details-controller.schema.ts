import { Type, type Static } from '@sinclair/typebox';
import { extendResourceObject } from '@lib/db';
import { nullable } from '@lib/schemas';

export const createNotificationDetailsRequestBodyDtoSchema = Type.Object(
  {
    type: Type.String(),
    default_location: Type.Optional(Type.Boolean()),
    active: Type.Optional(Type.Boolean()),
    trigger_value: Type.Optional(nullable(Type.Number())),
  },
  {
    additionalProperties: false,
    $id: 'CreateNotificationDetailsRequestBodyDto',
  },
);
export type CreateNotificationDetailsRequestBodyDto = Static<
  typeof createNotificationDetailsRequestBodyDtoSchema
>;

export const notificationDetailsDtoSchema = extendResourceObject(
  Type.Object({
    type: Type.String(),
    trigger_value: nullable(Type.Number()),
    default_location: Type.Boolean(),
    active: Type.Boolean(),
  }),
  { $id: 'NotificationDetails' },
);
export type NotificationDetailsDto = Static<
  typeof notificationDetailsDtoSchema
>;

export const patchNotificationDetailsRequestBodyDtoSchema = Type.Object(
  {
    type: Type.Optional(Type.String()),
    trigger_value: Type.Optional(nullable(Type.Number())),
    default_location: Type.Optional(Type.Boolean()),
    active: Type.Optional(Type.Boolean()),
  },
  {
    additionalProperties: false,
    $id: 'PatchNotificationDetailsRequestBodyDto',
  },
);
export type PatchNotificationDetailsRequestBodyDto = Static<
  typeof patchNotificationDetailsRequestBodyDtoSchema
>;
