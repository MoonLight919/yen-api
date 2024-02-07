import { applyDecorators, HttpCode } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { type TSchema } from '@sinclair/typebox';
import {
  type ApiResponseSchema,
  HeadersSchema,
  ParamsSchema,
  QuerySchema,
  ResponseSchema,
} from '@lib/decorators/swagger';

type RestMethodOptions = {
  responses?: Record<number, ApiResponseSchema>;
  headers?: TSchema;
  query?: TSchema;
  params?: TSchema;
  body?: TSchema;
  statusCode?: number;
};

export function RestMethod(options: RestMethodOptions): MethodDecorator {
  const { responses = {}, headers, query, params, body, statusCode } = options;
  const decorators: Array<MethodDecorator | ClassDecorator> = [];

  decorators.push(ResponseSchema(responses));

  if (headers) {
    decorators.push(HeadersSchema(headers));
  }
  if (query) {
    decorators.push(QuerySchema(query));
  }
  if (params) {
    decorators.push(ParamsSchema(params));
  }
  if (body) {
    decorators.push(
      ApiBody({
        schema: body,
      }),
    );
  }
  if (statusCode) {
    decorators.push(HttpCode(statusCode));
  }

  return applyDecorators(...decorators);
}
