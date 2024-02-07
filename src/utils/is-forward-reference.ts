import { type ForwardReference } from '@nestjs/common';

export const isForwardReference = <T>(
  maybeForwardReference: unknown,
): maybeForwardReference is ForwardReference<() => T> => {
  return !!(
    maybeForwardReference &&
    !!(maybeForwardReference as ForwardReference).forwardRef
  );
};
