export const asyncMap = async <T, U>(
  arr: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> => {
  return await Promise.all(arr.map(callbackfn));
};
