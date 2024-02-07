import {
  Catch,
  type ExceptionFilter,
  type ArgumentsHost,
  ForbiddenException,
} from '@nestjs/common';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { NotAuthenticatedRequestHttpException } from '../exceptions';

@Catch(ForbiddenException)
export class AuthExceptionFilter
  implements ExceptionFilter<ForbiddenException>
{
  catch(_: ForbiddenException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();
    const notAuthenticatedException = new NotAuthenticatedRequestHttpException(
      'You are not authenticated or requested resource is forbidden for you',
    );

    res.status(notAuthenticatedException.status).send({
      ...notAuthenticatedException,
      request_id: req.id,
      message: notAuthenticatedException.message,
    });
  }
}
