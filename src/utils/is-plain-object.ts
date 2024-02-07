import { getTag } from './get-tag';
import { isObjectLike } from './is-object-like';

export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  if (!isObjectLike(value) || getTag(value) !== '[object Object]') {
    return false;
  }

  if (Object.getPrototypeOf(value) === null) {
    return true;
  }

  let proto = value;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
};
