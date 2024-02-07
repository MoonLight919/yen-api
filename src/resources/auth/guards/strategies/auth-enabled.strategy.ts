import { type ExecutionContext, Injectable } from '@nestjs/common';
import { type ApplicationFastifyRequest } from '@modules/core';
import { httpAssert, isError } from '@utils';
import { AuthenticationService, JwtService } from '../../services';
import { type AuthStrategy } from '../../interfaces';
import {
  NotAuthenticatedRequestHttpException,
  TokenExpiredHttpException,
} from '../../exceptions';
import { TokenExpiredError } from '../../errors';

@Injectable()
export class AuthEnabledStrategy implements AuthStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async execute(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ApplicationFastifyRequest>();
    const tokenOrError = this.jwtService.extractJwtTokenFromRequest(req);
    httpAssert(
      !isError(tokenOrError),
      new NotAuthenticatedRequestHttpException(tokenOrError),
    );
    const userOrError = await this.authenticationService.retrieveUserByToken(
      tokenOrError,
    );
    httpAssert(
      !isError(userOrError, TokenExpiredError),
      new TokenExpiredHttpException(userOrError as TokenExpiredError),
    );
    httpAssert(
      !isError(userOrError),
      new NotAuthenticatedRequestHttpException(userOrError as Error),
    );
    req.user = userOrError;
    return true;
  }
}
