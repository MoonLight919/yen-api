import { UseGuards, Post, Body, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeController } from '@nestjs/swagger';
import { RestMethod } from '@modules/core/decorators';
import { httpAssert, isError } from '@utils';
import { AuthService } from '../services';
import { Auth0KeyAuthenticationGuard } from '../guards';
import { InvalidUserFromAuth0EventError } from '../errors';
import { InvalidUserFromAuth0EventException } from '../exceptions';
import { type Auth0EventLoginBodyDto, signupBodyDtoSchema } from '../schemas';

@ApiExcludeController(true)
@ApiTags('Auth')
@Controller('auth')
@UseGuards(Auth0KeyAuthenticationGuard)
export class Auth0Controller {
  constructor(private readonly authService: AuthService) {}

  @Post('post-registration')
  @ApiOperation({
    summary: 'Create user after auth0 sign up',
  })
  @RestMethod({
    statusCode: 204,
    body: signupBodyDtoSchema,
  })
  public async postRegistration(
    @Body() auth0Event: Auth0EventLoginBodyDto,
  ): Promise<void> {
    const userOrError = await this.authService.postRegistration(auth0Event);
    httpAssert(
      !(userOrError instanceof InvalidUserFromAuth0EventError),
      new InvalidUserFromAuth0EventException(
        userOrError as InvalidUserFromAuth0EventError,
      ),
    );
    httpAssert(!isError(userOrError), userOrError);
  }
}
