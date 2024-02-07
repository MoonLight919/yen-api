import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { type Observable } from 'rxjs';

export class RequestInterceptorInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const res = context.switchToHttp().getResponse<FastifyReply>();
    res.header('x-request-id', req.id);
    return next.handle();
  }
}
