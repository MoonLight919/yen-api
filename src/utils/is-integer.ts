export const polyfillIsInteger = function isInteger(n: unknown): n is number {
  return (n as number) << 0 === n;
};

export const isInteger = (value: unknown): value is number => {
  if (Number.isInteger) {
    return Number.isInteger(value);
  }
  return polyfillIsInteger(value);
};
