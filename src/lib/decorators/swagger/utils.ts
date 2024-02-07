import {
  type SchemaObject,
  type ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const isObjectSchema = (schema: unknown): schema is SchemaObject => {
  return !!(
    (schema as SchemaObject).type === 'object' &&
    (schema as SchemaObject).properties
  );
};

export const isValidSchema = (schema: unknown): schema is SchemaObject => {
  return (
    !!(schema as SchemaObject).type ||
    !!(schema as SchemaObject).anyOf ||
    !!(schema as SchemaObject).oneOf ||
    !!(schema as SchemaObject).allOf ||
    !!(schema as SchemaObject).not ||
    !!(schema as ReferenceObject).$ref
  );
};
