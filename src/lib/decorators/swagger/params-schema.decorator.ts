import { ApiParam } from '@nestjs/swagger';
import {
  type ReferenceObject,
  type SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { applyDecorators } from '@nestjs/common';
import { type TSchema } from '@sinclair/typebox';
import { isObjectSchema, isValidSchema } from './utils';

export const ParamsSchema = (schema: TSchema): MethodDecorator => {
  const decorators: MethodDecorator[] = [];

  if (isObjectSchema(schema)) {
    Object.entries(
      schema.properties as Record<string, SchemaObject | ReferenceObject>,
    ).forEach(([property, schema]) => {
      if (isValidSchema(schema)) {
        decorators.push(
          ApiParam({
            name: property,
            schema,
          }),
        );
      }
    });
  }

  return applyDecorators(...decorators);
};
