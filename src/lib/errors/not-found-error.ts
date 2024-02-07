import { type BusinessError } from '@lib/interfaces';

export class NotFoundError extends Error implements BusinessError {
  public code = 'not_found';
  constructor(message: string = 'Resource not found') {
    super(message);
  }
}
