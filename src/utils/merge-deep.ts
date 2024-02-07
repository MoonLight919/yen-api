import type { O } from 'ts-toolbelt';

export const mergeDeep = <T extends object, U extends object>(
  target: T,
  source: U,
): U | O.Merge<T, U, 'deep'> => {
  const isObject = (obj: unknown): obj is object =>
    !!obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  // clone target to avoid mutation
  const clonedTarget: Record<string, unknown> = {
    ...target,
  } as Record<string, unknown>;

  Object.keys(source).forEach((key) => {
    const targetValue = clonedTarget[key];
    const sourceValue = (source as Record<string, unknown>)[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      clonedTarget[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      clonedTarget[key] = mergeDeep(
        Object.assign({}, targetValue),
        sourceValue,
      );
    } else {
      clonedTarget[key] = sourceValue;
    }
  });

  return clonedTarget as O.Merge<T, U, 'deep'>;
};
