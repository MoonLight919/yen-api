import {
  Catch,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
  ServiceUnavailableException,
} from '@nestjs/common';
import { type HttpArgumentsHost } from '@nestjs/common/interfaces';
import { type FastifyError, type FastifyReply } from 'fastify';
import { captureException as sentryCaptureException } from '@sentry/node';
import { type Scope as ISentryScope } from '@sentry/types';
import { COMMAND_BUST_HOST_TYPE } from '@modules/cqrs/cqrs.constants';
import { type ApplicationFastifyRequest } from '@modules/core';
import {
  type ApiBaseHttpException,
  ServerHttpException,
  ServerUnavailableHttpException,
  UnsupportedMediaTypeHttpException,
} from '@lib/exceptions/api';
import { type ICommand } from '@modules/cqrs';

@Catch(Error, ServiceUnavailableException)
export class GlobalExceptionFilter implements ExceptionFilter<Error> {
  private readonly _logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    if (host.getType() === 'http') {
      this.handleHttpException(exception, host.switchToHttp());
    } else if ((host.getType() as string) === COMMAND_BUST_HOST_TYPE) {
      this.handleCommandBusException(exception, host);
    } else {
      this._logger.warn(`Unknown host type "${host.getType()}"`);
    }
  }

  private handleHttpException(exception: Error, ctx: HttpArgumentsHost): void {
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<ApplicationFastifyRequest>();
    const apiException = this.transformExceptionToApiException(exception);

    if (apiException instanceof ServerHttpException) {
      this.processHttpCriticalError(req, exception);
    }

    res.status(apiException.status).send({
      ...apiException,
      requestId: req.id,
      message: apiException.message,
    });
  }

  private handleCommandBusException(
    exception: Error,
    host: ArgumentsHost,
  ): void {
    this.processCommandBusCriticalError(
      exception,
      host.getArgByIndex(0),
      host.getArgByIndex(1),
    );
  }

  private transformExceptionToApiException(
    exception: Error,
  ): ApiBaseHttpException {
    if (exception instanceof ServiceUnavailableException) {
      return new ServerUnavailableHttpException(exception.message);
    } else if (
      this.isFastifyError(exception) &&
      this.isFastifyUnsupportedMediaType(exception)
    ) {
      return new UnsupportedMediaTypeHttpException(exception.message);
    } else {
      return new ServerHttpException(exception);
    }
  }

  private isFastifyError(error: Error): error is FastifyError {
    return 'code' in error;
  }

  private isFastifyUnsupportedMediaType(fastifyError: FastifyError): boolean {
    return fastifyError.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE';
  }

  private processHttpCriticalError(
    req: ApplicationFastifyRequest,
    exception: Error,
  ): void {
    this._logger.error(
      {
        ...exception,
        traceId: req.metadata.traceId,
        msg: exception.message,
        headers: req.headers,
        query: req.query,
        body: req.body,
        params: req.params,
        ip: req.ip,
      },
      exception.stack,
    );
    this.sendToSentry(exception, req.sentryScope);
  }

  private processCommandBusCriticalError(
    exception: Error,
    command: ICommand,
    sentryScope: ISentryScope,
  ): void {
    this._logger.error(
      {
        ...exception,
        traceId: command.traceId,
        commandId: command.id,
        commandName: command.constructor.name,
        msg: exception.message,
        command,
      },
      exception.stack,
    );
    this.sendToSentry(exception, sentryScope);
  }

  private sendToSentry(exception: Error, sentryScope: ISentryScope): void {
    const transaction = sentryScope.getTransaction();
    if (transaction) {
      transaction.setStatus('internal_error');
    }
    sentryCaptureException(exception, () => sentryScope);
  }
}
