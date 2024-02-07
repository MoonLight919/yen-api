import { ApiResponse, type ApiResponseSchemaHost } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { type TSchema } from '@sinclair/typebox';
import { exceptionSchema, httpExceptionSchema, ref } from '@lib/schemas';

export interface ApiResponseSchema
  extends Omit<ApiResponseSchemaHost, 'schema'> {
  schema: TSchema;
}

const defaultMapErrorResponses: Record<number, ApiResponseSchema> = {
  400: {
    description:
      'User validation is failed and requires to change request body before make request again',
    schema: ref(httpExceptionSchema),
  },
  401: {
    description: 'Token was not provided or token invalid',
    schema: ref(exceptionSchema),
  },
  403: {
    description: `Forbidden resource. User doesn't have required permissions to make an action on requested resource`,
    schema: ref(exceptionSchema),
  },
  404: {
    description: 'Url is invalid or resource was not found',
    schema: ref(exceptionSchema),
  },
  500: {
    description: 'Internal Server Error',
    schema: ref(exceptionSchema),
  },
  503: {
    description: 'Service is unavailable',
    schema: ref(exceptionSchema),
  },
};

export const ResponseSchema = (
  responseMap: Record<number, ApiResponseSchema> = {},
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ...Object.entries({
      ...defaultMapErrorResponses,
      ...responseMap,
    }).map(([statusCode, { schema, ...apiResponseOptions }]) =>
      ApiResponse({
        ...apiResponseOptions,
        status: parseInt(statusCode),
        schema,
      }),
    ),
  );
};
