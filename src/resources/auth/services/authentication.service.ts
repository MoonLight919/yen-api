import { Injectable } from '@nestjs/common';
import { isError } from '@utils';
import { UserService } from '../../user/services';
import { type UserRecord } from '../../user/interfaces';
import {
  NotAuthenticatedRequestError,
  type TokenExpiredError,
} from '../errors';
import { type JwtOptions } from '../interfaces';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async retrieveUserByToken(
    jwt: string,
  ): Promise<UserRecord | TokenExpiredError | Error> {
    const jwtOptionsOrError = this.jwtService.decode(jwt);
    if (isError(jwtOptionsOrError)) {
      return jwtOptionsOrError;
    }
    const userOrError = await this.verifyAndRetrieveAuth0User(
      jwt,
      jwtOptionsOrError,
    );
    if (isError(userOrError)) {
      return userOrError;
    }
    return userOrError;
  }

  private async verifyAndRetrieveAuth0User(
    token: string,
    jwt: JwtOptions,
  ): Promise<UserRecord | TokenExpiredError | Error> {
    const isValidJwtOrTokenException = await this.jwtService.verifyAuth0(
      token,
      jwt,
    );
    if (isError(isValidJwtOrTokenException)) {
      return isValidJwtOrTokenException;
    }
    if (!isValidJwtOrTokenException) {
      return new NotAuthenticatedRequestError('Invalid JWT token');
    }
    const user = await this.userService.retrieveBy({ sub: jwt.payload.sub });
    if (!user) {
      return new NotAuthenticatedRequestError(`User not found`);
    }
    return user;
  }
}
