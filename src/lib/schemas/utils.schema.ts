import { Type, type TSchema, type TRef, Kind } from '@sinclair/typebox';
import { isString } from '@utils';

export const getSchemaPath = <T extends TSchema>(schema: T | string): string =>
  `#/components/schemas/${isString(schema) ? schema : schema.$id}`;

export function ref<T extends TSchema>(schema: T | string): TRef<T> {
  if (isString(schema)) {
    return Type.Unsafe({
      $ref: getSchemaPath(schema),
      [Kind]: 'Ref',
    }) as TRef<T>;
  }
  if (!schema.$id) {
    throw new Error(`You did not provide id for schema`);
  }
  return Type.Unsafe({
    $ref: getSchemaPath(schema.$id),
    [Kind]: 'Ref',
  }) as TRef<T>;
}
