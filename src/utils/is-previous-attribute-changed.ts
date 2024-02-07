export const isPreviousAttributeChanged = <T extends object, K extends keyof T>(
  previousAttributes: T | undefined,
  field: K,
): previousAttributes is T & Record<K, NonNullable<T[K]>> => {
  return !!previousAttributes && field in previousAttributes;
};
