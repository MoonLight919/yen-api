export function httpAssert<T>(value: T, errorLike: unknown): asserts value {
  if (!value) {
    throw errorLike;
  }
}
