import { type BusinessError } from '@lib/interfaces';

export class NotAuthenticatedRequestError
  extends Error
  implements BusinessError
{
  public code = 'not_authenticated_request';

  constructor(message?: string) {
    super(message || `You are not authenticated`);
  }
}
