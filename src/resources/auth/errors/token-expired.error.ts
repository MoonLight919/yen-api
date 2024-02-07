import { type BusinessError } from '@lib/interfaces';

export class TokenExpiredError extends Error implements BusinessError {
  public code = 'token_expired';

  constructor(message?: string) {
    super(message || `Your token is expired. Please try to login again`);
  }
}
