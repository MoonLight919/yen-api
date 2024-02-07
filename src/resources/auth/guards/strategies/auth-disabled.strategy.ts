import { type ExecutionContext, Injectable } from '@nestjs/common';
import { ResourceMissingHttpException } from '@lib/exceptions/api';
import { type ApplicationFastifyRequest } from '@modules/core';
import { httpAssert } from '@utils';
import { UserService } from '../../../user/services';
import { type AuthStrategy } from '../../interfaces';

@Injectable()
export class AuthDisabledStrategy implements AuthStrategy {
  constructor(private readonly userService: UserService) {}

  public async execute(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ApplicationFastifyRequest>();

    const idUser = this.extractUserId(req);
    httpAssert(
      idUser,
      new Error(
        'Authentication is disabled in your feature flags. Please, to using application with disabled authentication, send `dev-user-id` header with valid id user',
      ),
    );
    const user = await this.userService.retrieve(idUser);
    httpAssert(
      user,
      new ResourceMissingHttpException(`User with id "${idUser}" not found`),
    );
    req.user = user;
    return true;
  }

  private extractUserId(req: ApplicationFastifyRequest): string | null {
    return req.headers['dev-user-id'] ?? null;
  }
}
