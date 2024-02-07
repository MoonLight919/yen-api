export const flatAllSettled = <T>(
  results: PromiseSettledResult<T>[],
): Array<T | Error> =>
  results.map((result) =>
    result.status === 'fulfilled' ? result.value : result.reason,
  );
