import {
  Catch,
  type ExceptionFilter,
  type ArgumentsHost,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { NotFoundHttpException } from '@lib/exceptions/api/http';

@Catch(NestNotFoundException)
export class NotFoundExceptionFilter
  implements ExceptionFilter<NestNotFoundException>
{
  catch(_: NestNotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();
    const urlInvalidException = new NotFoundHttpException();

    res.status(urlInvalidException.status).send({
      ...urlInvalidException,
      request_id: req.id,
      message: urlInvalidException.message,
    });
  }
}
