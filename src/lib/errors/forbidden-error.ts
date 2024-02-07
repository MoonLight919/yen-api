import { type BusinessError } from '@lib/interfaces';

export class ForbiddenError extends Error implements BusinessError {
  public code = 'forbidden';
  constructor(message: string = 'Forbidden action') {
    super(message);
  }
}
