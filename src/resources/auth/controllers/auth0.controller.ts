import { UseGuards, Post, Body, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeController } from '@nestjs/swagger';
import { RestMethod } from '@modules/core/decorators';
import { httpAssert, isError } from '@utils';
import { AuthService } from '../services';
import { Auth0KeyAuthenticationGuard } from '../guards';
import { InvalidUserFromAuth0EventError } from '../errors';
import { InvalidUserFromAuth0EventException } from '../exceptions';
import {
  Auth0AuthorisationBodyDto,
  auth0AuthorisationBodyDtoSchema,
  type Auth0EventPostUserRegistrationBodyDto,
  signupBodyDtoSchema,
} from '../schemas';

@ApiExcludeController(true)
@ApiTags('Auth')
@Controller('auth')
@UseGuards(Auth0KeyAuthenticationGuard)
export class Auth0Controller {
  constructor(private readonly authService: AuthService) {}

  @Post('authorize')
  @ApiOperation({
    summary: 'Get an access token',
  })
  @RestMethod({
    statusCode: 200,
    body: auth0AuthorisationBodyDtoSchema,
  })
  public async authorize(
    @Body() auth0AuthorisationBodyDto: Auth0AuthorisationBodyDto,
  ): Promise<string> {
    return this.authService.authorize(auth0AuthorisationBodyDto);
  }

  @Post('post-registration')
  @ApiOperation({
    summary: 'Create user after auth0 sign up',
  })
  @RestMethod({
    statusCode: 204,
    body: signupBodyDtoSchema,
  })
  public async postRegistration(
    @Body() auth0Event: Auth0EventPostUserRegistrationBodyDto,
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
