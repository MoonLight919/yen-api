/* eslint-disable @typescript-eslint/no-explicit-any */
import { isInteger } from './is-integer';
import { nth } from './nth';

export const paths = (pathsArray: unknown[][], obj: unknown): unknown[] => {
  return pathsArray.map((nestedPaths) => {
    let val: any = obj;
    let idx = 0;
    let p;

    while (idx < nestedPaths.length) {
      if (val == null) {
        return undefined;
      }

      p = nestedPaths[idx];
      val = isInteger(p) ? nth(p, val as unknown[]) : val[p as string];
      idx += 1;
    }

    return val;
  });
};
