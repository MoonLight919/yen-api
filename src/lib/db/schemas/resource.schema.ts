import {
  type ObjectOptions,
  type Static,
  type TIntersect,
  type TObject,
  Type,
} from '@sinclair/typebox';
import { nullable, ref } from '@lib/schemas';

export const idSchema = Type.String({
  $id: 'ID',
  description: 'Unique identifier for the object.',
});

export const resourceObjectSchema = Type.Object(
  {
    id: ref(idSchema),
    created_at: Type.Number(),
    updated_at: Type.Number(),
    deleted_at: nullable(Type.Number()),
    object: Type.String(),
  },
  { $id: 'ResourceObject' },
);

export type ResourceObject = Static<typeof resourceObjectSchema>;

export type ID = Static<typeof idSchema>;

export const extendResourceObject = <T extends TObject>(
  schema: T,
  options: ObjectOptions = {},
): TIntersect<[typeof resourceObjectSchema, T]> =>
  Type.Intersect([Type.Omit(resourceObjectSchema, ['object']), schema], {
    additionalProperties: false,
    ...options,
  });
