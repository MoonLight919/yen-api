import { Type } from '@sinclair/typebox';
import { ref } from './utils.schema';

export const exceptionSchema = Type.Object(
  {
    request_id: Type.String(),
    message: Type.String(),
    type: Type.Union([
      Type.Literal('api_error'),
      Type.Literal('authentication_error'),
      Type.Literal('user_error'),
      Type.Literal('validation_error'),
    ]),
    code: Type.String(),
  },
  { $id: 'Exception', additionalProperties: false },
);

export const validationErrorSchema = Type.Object(
  {
    name: Type.String(),
    keyword: Type.String(),
    message: Type.String(),
  },
  { $id: 'ValidationError', additionalProperties: false },
);

export const validationExceptionSchema = Type.Object(
  {
    request_id: Type.String(),
    message: Type.String(),
    type: Type.Literal('validation_error'),
    code: Type.String(),
    errors: Type.Array(ref(validationErrorSchema)),
  },
  { $id: 'ValidationException', additionalProperties: false },
);

export const httpExceptionSchema = Type.Union(
  [ref(exceptionSchema), ref(validationExceptionSchema)],
  { $id: 'HttpException' },
);
