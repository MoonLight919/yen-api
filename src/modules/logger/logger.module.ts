import { type IncomingMessage } from 'node:http';
import { Module } from '@nestjs/common';
import { LoggerModule as NestjsPinoLoggerModule } from 'nestjs-pino';
import { pino } from 'pino';
import { appConfig, type AppConfig } from '@config/app.config';

@Module({
  imports: [
    NestjsPinoLoggerModule.forRootAsync({
      useFactory: (config: AppConfig) => {
        const { extremeMode, ...loggerOptions } = config.logger;
        const dest = pino.destination({
          sync: !extremeMode.enabled,
          minLength: extremeMode.enabled ? extremeMode.minLength : undefined,
        });
        const logger = pino(loggerOptions, dest);

        return {
          pinoHttp: {
            // eslint-disable-next-line
            logger: logger as any, // nestjs-pino uses own pino version which causes conflicts when upgrades our pino version
            customProps: (req) => ({
              traceId: (req as IncomingMessage & { traceId: string }).traceId,
            }),
          },
          ...loggerOptions,
        };
      },
      inject: [appConfig.KEY],
    }),
  ],
})
export class LoggerModule {}
