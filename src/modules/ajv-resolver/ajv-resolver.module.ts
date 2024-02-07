import { Module, type OnModuleInit } from '@nestjs/common';
import { AjvValidator } from 'nestjs-validation';
import { type TSchema } from '@sinclair/typebox';
import {
  exceptionSchema,
  getSchemaPath,
  headersSchema,
  httpExceptionSchema,
  validationErrorSchema,
  validationExceptionSchema,
} from '@lib/schemas';
import {
  dataOptionsDtoSchema,
  dateFilterDtoSchema,
  idSchema,
  listOptionsDtoSchema,
  resourceObjectSchema,
} from '@lib/db';
import {
  userDtoSchema,
  retrieveCurrentUserResponseDtoSchema,
} from '@resources/user/schemas';

export const componentSchemas = [
  idSchema,
  exceptionSchema,
  validationErrorSchema,
  validationExceptionSchema,
  httpExceptionSchema,
  headersSchema,
  dataOptionsDtoSchema,
  listOptionsDtoSchema,
  resourceObjectSchema,
  dateFilterDtoSchema,
  userDtoSchema,
  retrieveCurrentUserResponseDtoSchema,
];

@Module({})
export class AjvResolverModule implements OnModuleInit {
  constructor(private readonly ajvValidator: AjvValidator) {}
  public onModuleInit(): void {
    this.addSchemas(componentSchemas);
  }

  private addSchemas(schemas: TSchema[]): void {
    schemas
      .filter((schema): schema is TSchema & { $id: string } => !!schema.$id)
      .forEach((schema) =>
        this.ajvValidator.ajv.addSchema({
          ...schema,
          $id: getSchemaPath(schema.$id),
          $async: true,
        }),
      );
  }
}
