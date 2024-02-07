import { getTag } from './get-tag';

export const isString = (value: unknown): value is string => {
  const type = typeof value;

  return (
    type === 'string' ||
    (type === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      getTag(value) === '[object String]')
  );
};
