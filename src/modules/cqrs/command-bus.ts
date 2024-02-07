import { CommandBus as NestCommandBus } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import {
  startTransaction as sentryStartTransaction,
  Scope as SentryScope,
} from '@sentry/node';
import { isError } from '@utils';
import { MetadataContainer } from '@modules/core/metadata';
import { type ParentSentryTrace, SentryTracer } from '@modules/core/lib';
import { GlobalExceptionFilter } from '@modules/core/filters';
import { COMMAND_BUST_HOST_TYPE } from './cqrs.constants';
import { type ICommand } from './interfaces';

@Injectable()
export class CommandBus extends NestCommandBus<ICommand> {
  private readonly _logger = new Logger(CommandBus.name);
  private readonly _globalExceptionFilter = new GlobalExceptionFilter();

  public async execute<T extends ICommand, R = unknown>(
    command: T,
    /* TODO Need to find the way how to fix type error in more elegant way */
    /* @ts-expect-error wrong type definition for `execute` method */
  ): Promise<R> {
    const commandName = command.constructor.name;
    const transaction = sentryStartTransaction({
      op: 'job.exec',
      name: commandName,
      ...this.extractParentTrace(command),
    });
    const sentryScope = new SentryScope();
    sentryScope.setSpan(transaction);
    command.metadata = MetadataContainer.cloneFrom(
      command.parentMetadata,
      transaction.toTraceparent(),
    );
    this._logger.log(
      {
        traceId: command.traceId,
        commandId: command.id,
        spanId: transaction.spanId,
        commandName,
        command,
      },
      'incoming command',
    );
    const host = new ExecutionContextHost([command, sentryScope]);
    host.setType(COMMAND_BUST_HOST_TYPE);
    try {
      const commandResult = await super.execute(command);
      transaction.setStatus('ok');
      return commandResult;
    } catch (err) {
      this._globalExceptionFilter.catch(this.extractError(err), host);
    } finally {
      this._logger.log(
        {
          traceId: command.traceId,
          commandId: command.id,
          spanId: transaction.spanId,
          commandName,
        },
        'command completed',
      );
      transaction.finish();
    }
  }

  private extractParentTrace(command: ICommand): ParentSentryTrace {
    return SentryTracer.extractParentTrace(
      command.parentMetadata.parentTraceId ?? command.parentMetadata.traceId,
    );
  }

  private extractError(err: unknown): Error {
    if (isError(err)) {
      return err;
    }

    return new Error(typeof err === 'string' ? err : 'Unknown error');
  }
}
