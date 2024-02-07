export const coerceStringToBoolean = (value: unknown): boolean | null => {
  if (typeof value !== 'string') {
    return null;
  }
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  return null;
};
