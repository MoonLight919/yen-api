import { type Type } from '@nestjs/common';

export function isError<T extends Error>(maybeError: unknown): maybeError is T;
export function isError<T extends Type<Error>>(
  maybeError: unknown,
  errorInstance: T,
): maybeError is T;
export function isError<T extends Error>(
  maybeError: unknown,
  errorInstance?: unknown,
): maybeError is T {
  return errorInstance
    ? maybeError instanceof (errorInstance as Function)
    : maybeError instanceof Error;
}
