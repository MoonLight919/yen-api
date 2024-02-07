import {
  Catch,
  type ExceptionFilter,
  type Type,
  type ArgumentsHost,
} from '@nestjs/common';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { BaseHttpException } from '@lib/exceptions/base.http-exception';

@Catch(BaseHttpException as unknown as Type)
export class HttpExceptionFilter implements ExceptionFilter<BaseHttpException> {
  catch(exception: BaseHttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();

    res.status(exception.status).send({
      ...exception,
      request_id: req.id,
      message: exception.message,
    });
  }
}
