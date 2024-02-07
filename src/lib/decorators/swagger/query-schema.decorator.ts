import { ApiQuery } from '@nestjs/swagger';
import {
  type ReferenceObject,
  type SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { applyDecorators } from '@nestjs/common';
import { type TSchema } from '@sinclair/typebox';
import { isObjectSchema, isValidSchema } from './utils';

export const QuerySchema = (schema: TSchema): MethodDecorator => {
  const decorators: MethodDecorator[] = [];

  if (isObjectSchema(schema)) {
    Object.entries(
      schema.properties as Record<string, SchemaObject | ReferenceObject>,
    ).forEach(([property, propertySchema]) => {
      if (isValidSchema(propertySchema)) {
        decorators.push(
          ApiQuery({
            name: property,
            schema: propertySchema,
            description: propertySchema.description ?? '',
            required:
              (schema.required as string[] | undefined)?.includes(property) ??
              false,
          }),
        );
      }
    });
  }

  return applyDecorators(...decorators);
};
