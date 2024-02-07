type Many<T> = T | ReadonlyArray<T>;

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...paths: Array<Many<K>>
): Pick<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => paths.includes(key as K)),
  ) as Pick<T, K>;
};
