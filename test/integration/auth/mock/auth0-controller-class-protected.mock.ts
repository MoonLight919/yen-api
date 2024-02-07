import { Controller, Get } from '@nestjs/common';
import { AuthProtected } from '@resources/auth/decorators';

@Controller('auth0-class')
@AuthProtected()
export class Auth0ControllerClassProtectedMock {
  @Get('protected')
  public async bearerProtected(): Promise<{}> {
    return {};
  }
}
