import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { type FastifyRequest } from 'fastify';
import { auth0Config, Auth0Config } from '@config/auth0.config';
import { httpAssert } from '@utils';
import { ApiKeyRequiredHttpException } from '../exceptions';

@Injectable()
export class Auth0KeyAuthenticationGuard implements CanActivate {
  constructor(
    @Inject(auth0Config.KEY)
    private readonly a0c: Auth0Config,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const apiKey = this.extractApiKeyFromRequest(
      context.switchToHttp().getRequest(),
    );
    httpAssert(apiKey, new ApiKeyRequiredHttpException());
    httpAssert(
      this.a0c.hooks.apiKey === apiKey,
      new ApiKeyRequiredHttpException(`API key is invalid`),
    );
    return true;
  }

  private extractApiKeyFromRequest(
    req: FastifyRequest<{ Headers: { 'x-api-key'?: string } }>,
  ): string | null {
    return req.headers['x-api-key'] ?? null;
  }
}
