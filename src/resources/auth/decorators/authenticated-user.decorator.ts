import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type ApplicationFastifyRequest } from '@modules/core';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<ApplicationFastifyRequest>();
    return req.user ?? null;
  },
);
