import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type ApplicationFastifyRequest } from '../interfaces';

export const Metadata = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<ApplicationFastifyRequest>();
    return req.metadata;
  },
);
