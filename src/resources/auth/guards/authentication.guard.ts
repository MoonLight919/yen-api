import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  type OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { type User } from '@sentry/types';
import { featuresConfig, FeaturesConfig } from '@config/features.config';
import { type ApplicationFastifyRequest } from '@modules/core';
import { type AuthStrategy } from '../interfaces';
import { AUTH_TYPES } from '../auth.constants';
import { AuthDisabledStrategy, AuthEnabledStrategy } from './strategies';

@Injectable()
export class AuthenticationGuard implements CanActivate, OnModuleInit {
  private strategy: AuthStrategy | null = null;

  constructor(
    @Inject(featuresConfig.KEY)
    private readonly fc: FeaturesConfig,
    private readonly moduleRef: ModuleRef,
  ) {}

  public async onModuleInit(): Promise<void> {
    if (this.fc.auth) {
      this.strategy = await this.moduleRef.create(AuthEnabledStrategy);
    } else {
      this.strategy = await this.moduleRef.create(AuthDisabledStrategy);
    }
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await (this.strategy as AuthStrategy).execute(context);
    const req = context.switchToHttp().getRequest<ApplicationFastifyRequest>();
    if (req.user) {
      req.metadata.setIdUser(req.user.id);
      req.metadata.setAuthType(AUTH_TYPES.TOKEN);
      req.sentryScope.setUser(req.user as User); // Sentry User type requires `email` field to be string or undefined, but they also accept `null`. So we just ignore type error here
    }
    return result;
  }
}
