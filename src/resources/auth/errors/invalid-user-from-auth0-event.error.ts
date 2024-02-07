import { type BusinessError } from '@lib/interfaces';

export class InvalidUserFromAuth0EventError
  extends Error
  implements BusinessError
{
  public code = 'validation_failed';

  constructor(event?: string) {
    super(`User on [${event || 'unknown'}] doesn't have required fields`);
  }
}
