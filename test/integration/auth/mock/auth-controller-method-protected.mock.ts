import { Controller, Get } from '@nestjs/common';
import { RestMethod } from '@modules/core/decorators';
import { AuthProtected } from '@resources/auth/decorators';

@Controller('auth-method')
export class AuthControllerMethodMock {
  @Get('allow')
  @RestMethod({})
  public async allow(): Promise<{ allowed: boolean }> {
    return { allowed: true };
  }

  @Get('auth0-protected')
  @RestMethod({})
  @AuthProtected()
  public async auth0Protected(): Promise<{}> {
    return {};
  }
}
