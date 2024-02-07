export const isObjectHasSome = (
  obj: object = {},
  ...keys: string[]
): boolean => {
  return keys.some((key) => obj.hasOwnProperty(key));
};
