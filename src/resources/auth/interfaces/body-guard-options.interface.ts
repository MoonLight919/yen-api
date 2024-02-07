import { type ExecutionContext } from '@nestjs/common';

export interface BodyFieldsGuardSchema<T, TField = unknown> {
  name: keyof T;
  canActivate?: (field: TField, context: ExecutionContext) => boolean;
}

export interface BodyGuardOptions<T> {
  fields: BodyFieldsGuardSchema<T>[];
}
