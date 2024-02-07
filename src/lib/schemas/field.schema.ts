import {
  Type,
  type TSchema,
  type TUnion,
  type TString,
  type TRef,
  type Static,
  type TUnsafe,
  type TNull,
} from '@sinclair/typebox';
import { TypeGuard } from '@sinclair/typebox/guard';
import { constantsToArray } from '@utils';
import { COLOR_HEX_REGEX, PHONE_NUMBER_REGEX } from '@lib/regex.constants';
import { ref } from './utils.schema';

export const timestampSchema = Type.Number({
  description: 'Timestamp in unix format',
});

export const stringSchema = Type.String({
  maxLength: 255,
  transform: ['trim'],
});

export const enumSchema = <T extends string>(
  enumObject: Record<string, T>,
): TUnsafe<T> =>
  Type.Unsafe({ type: 'string', enum: constantsToArray(enumObject) });

export const emailSchema = Type.String({ format: 'email' });

export const urlSchema = Type.String({ format: 'uri' });

/*
 * Phone number in format 1968995375. Without leading '+' symbol
 * */
export const phoneNumberSchema = Type.RegEx(PHONE_NUMBER_REGEX);

export const colorHexSchema = Type.RegEx(COLOR_HEX_REGEX);

export function nullable<T extends TRef>(schema: T): TUnion<[TNull, T]>;
export function nullable<T extends TSchema>(
  schema: T,
): TUnsafe<Static<T> | null>;
export function nullable<T extends TSchema>(
  schema: T,
): TUnsafe<Static<T> | null> | TUnion<[TNull, TRef<T>]> {
  if (TypeGuard.TRef(schema)) {
    return Type.Union([Type.Null(), schema]);
  }
  if (TypeGuard.TUnion(schema)) {
    const { anyOf, ...options } = schema;
    return Type.Union([Type.Null(), ...anyOf], options);
  }
  return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true });
}

/*
 * Use if property can be id or expanded resource
 * */
export const foreignRef = <T extends TSchema>(
  schema: T | string,
): TUnion<[TString, TRef<T>]> => Type.Union([Type.String(), ref(schema)]);
