import { isPlainObject } from './is-plain-object';

export interface DiffOptions {
  deep?: boolean;
  allowedKeys?: string[];
  avoidKeys?: string[];
}

const arraysMatch = (arr1: unknown[], arr2: unknown[]): boolean => {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if all items exist and are in the same order
  for (const i in arr1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // Otherwise, return true
  return true;
};

const compare = (
  diffs: Record<string, unknown>,
  item1: unknown,
  item2: unknown,
  key: string,
  diffOptions: DiffOptions,
): void => {
  // Get the object type
  const type1 = Object.prototype.toString.call(item1);
  const type2 = Object.prototype.toString.call(item2);

  // If type2 is undefined it has been removed
  if (type2 === '[object Undefined]') {
    diffs[key] = null;
    return;
  }

  // If items are different types
  if (type1 !== type2) {
    diffs[key] = item2;
    return;
  }

  if (diffOptions.deep) {
    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2, diffOptions);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (Array.isArray(item1) && Array.isArray(item2)) {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }
  } else if (type1 === '[object Object]' || type1 === '[object Array]') {
    // if it's not deep diff just skip objects and arrays
    return;
  }

  // Otherwise, just compare
  if (item1 !== item2) {
    diffs[key] = item2;
  }
};

const isShouldUpdateKey = <T extends object>(
  obj: T,
  key: string,
  {
    allowedKeys,
    avoidKeys,
  }: Pick<DiffOptions, 'allowedKeys' | 'avoidKeys'> = {},
): boolean => {
  if (obj.hasOwnProperty(key)) {
    if (allowedKeys && allowedKeys.length) {
      return allowedKeys.includes(key);
    }
    if (avoidKeys && avoidKeys.length) {
      return !avoidKeys.includes(key);
    }
    return true;
  }
  return false;
};

export const diff = <T>(
  base: T,
  payload: T,
  { deep = true, allowedKeys = [], avoidKeys = [] }: DiffOptions = {},
): Partial<T> => {
  if (!isPlainObject(base)) {
    return {};
  }
  if (!isPlainObject(payload)) {
    return {};
  }

  const diffs: Record<string, unknown> = {};
  let key;

  // Loop through the first object
  for (key in base) {
    if (isShouldUpdateKey(base, key, { allowedKeys, avoidKeys })) {
      compare(diffs, base[key], payload[key], key, {
        deep,
        allowedKeys,
        avoidKeys,
      });
    }
  }

  // Loop through the second object and find missing items
  for (key in payload) {
    if (isShouldUpdateKey(payload, key, { allowedKeys, avoidKeys })) {
      if (!base[key] && base[key] !== payload[key]) {
        diffs[key] = payload[key];
      }
    }
  }

  return diffs as Partial<T>;
};
