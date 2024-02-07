import {
  decode as jwtDecode,
  verify as jwtVerify,
  TokenExpiredError as JsonWebTokenExpiredError,
  type VerifyOptions,
} from 'jsonwebtoken';
import { parse as qsParse } from 'qs';
import {
  type CertSigningKey,
  JwksClient,
  type RsaSigningKey,
  SigningKeyNotFoundError,
} from 'jwks-rsa';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { type FastifyRequest } from 'fastify';
import { isError, isString } from '@utils';
import { auth0Config, Auth0Config } from '@config/auth0.config';
import { type JwtOptions } from '../interfaces';
import { NotAuthenticatedRequestError, TokenExpiredError } from '../errors';

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);
  private readonly jwksClient: JwksClient;
  private readonly jwtAuth0VerifyOptions: VerifyOptions;

  constructor(
    @Inject(auth0Config.KEY)
    private readonly a0c: Auth0Config,
  ) {
    this.jwksClient = new JwksClient({
      jwksUri: `https://${this.a0c.domain}/.well-known/jwks.json`,
    });
    this.jwtAuth0VerifyOptions = {
      issuer: `https://${this.a0c.domain}/`,
    };
  }

  public decode(token: string): JwtOptions | Error {
    const decoded = jwtDecode(token, { complete: true });
    if (!decoded) {
      return new NotAuthenticatedRequestError(`Invalid jwt token`);
    }
    if (isString(decoded)) {
      this.logger.error(decoded);
      return new Error(
        `Strange situation with decoded jwt payload. Should be considered more deeply`,
      );
    }
    return decoded as JwtOptions;
  }

  public async verifyAuth0(
    jwtToken: string,
    jwtOptions: JwtOptions,
  ): Promise<TokenExpiredError | boolean | Error> {
    const keyOrError = await this.getSigningKey(jwtOptions.header.kid);
    if (isError(keyOrError)) {
      return keyOrError;
    }
    if (!keyOrError) {
      return false;
    }
    const secret = this.getJwksSecret(keyOrError);
    return this.verifyJwtToken(jwtToken, secret, this.jwtAuth0VerifyOptions);
  }

  public extractJwtTokenFromRequest(
    req: FastifyRequest,
  ): string | NotAuthenticatedRequestError {
    if (!req.headers.authorization) {
      return new NotAuthenticatedRequestError(
        `You did not provide an Authorization header. You need to provide your credentials in the Authorization header, using Bearer auth (e.g. 'Authorization: Bearer YOUR_JWT_KEY')`,
      );
    }
    const authHeader = req.headers.authorization;
    const [scheme, token] = authHeader.split(' ');
    if (!scheme || !token) {
      return new NotAuthenticatedRequestError(
        'Format is Authorization: Bearer [token]',
      );
    }
    if (/^Bearer$/i.test(scheme)) {
      return token;
    } else {
      return new NotAuthenticatedRequestError(
        'Format is Authorization: Bearer [token]',
      );
    }
  }

  public extractJwtTokenFromQuery(
    url?: string,
  ): string | NotAuthenticatedRequestError {
    if (!url) {
      return new NotAuthenticatedRequestError(
        `You did not provide an authorization query. You need to provide your credentials in the query with 'jwt' param (e.g. '?jwt=YOUR_JWT_KEY')`,
      );
    }
    url = url.substring(1, url.length);
    const { jwt } = qsParse(url, { ignoreQueryPrefix: true });
    if (!jwt) {
      return new NotAuthenticatedRequestError(
        `You did not provide an authorization query. You need to provide your credentials in the query with 'jwt' param (e.g. '?jwt=YOUR_JWT_KEY')`,
      );
    }
    if (!isString(jwt)) {
      return new NotAuthenticatedRequestError(
        `You did provide an invalid jwt token`,
      );
    }
    return jwt;
  }

  private async getSigningKey(
    kid: string,
  ): Promise<CertSigningKey | RsaSigningKey | false | Error> {
    try {
      return await this.jwksClient.getSigningKey(kid);
    } catch (err) {
      if (isError(err, SigningKeyNotFoundError)) {
        return false;
      }
      return err as Error;
    }
  }

  private async verifyJwtToken(
    jwtToken: string,
    secret: string,
    options: VerifyOptions,
  ): Promise<TokenExpiredError | boolean> {
    return new Promise((resolve) => {
      jwtVerify(jwtToken, secret, options, (err) => {
        if (isError(err, JsonWebTokenExpiredError)) {
          return resolve(new TokenExpiredError());
        }
        if (err) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  private getJwksSecret(key: CertSigningKey | RsaSigningKey): string {
    if (this.isRsaSigningKey(key)) {
      return key.rsaPublicKey;
    }
    return key.publicKey;
  }

  private isRsaSigningKey(
    key: CertSigningKey | RsaSigningKey,
  ): key is RsaSigningKey {
    return key.hasOwnProperty('rsaPublicKey');
  }
}
