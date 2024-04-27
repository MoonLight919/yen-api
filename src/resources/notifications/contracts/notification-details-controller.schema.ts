import { Type, type Static } from '@sinclair/typebox';
import { extendResourceObject } from '@lib/db';
import { nullable } from '@lib/schemas';

export const createNotificationDetailsRequestBodyDtoSchema = Type.Object(
  {
    type: Type.String(),
    default_location: Type.Optional(Type.Boolean()),
    active: Type.Optional(Type.Boolean()),
    upper_border: Type.Optional(nullable(Type.Number())),
    lower_border: Type.Optional(nullable(Type.Number())),
    trigger_value: Type.Optional(nullable(Type.Number())),
    upper_border_active: Type.Optional(Type.Boolean()),
    lower_border_active: Type.Optional(Type.Boolean()),
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
    upper_border: nullable(Type.Number()),
    lower_border: nullable(Type.Number()),
    trigger_value: nullable(Type.Number()),
    upper_border_active: Type.Boolean(),
    lower_border_active: Type.Boolean(),
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
    upper_border: Type.Optional(nullable(Type.Number())),
    lower_border: Type.Optional(nullable(Type.Number())),
    trigger_value: Type.Optional(nullable(Type.Number())),
    upper_border_active: Type.Optional(Type.Boolean()),
    lower_border_active: Type.Optional(Type.Boolean()),
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
