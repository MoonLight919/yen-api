import { type NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { appConfig, type AppConfig } from '@config/app.config';
import { setupApplication } from './setup-application';
import { setupSwagger } from './setup-swagger';

export const bootstrap = async (
  options?: NestApplicationContextOptions,
): Promise<NestFastifyApplication> => {
  const app = await setupApplication(options);
  const config = app.get<AppConfig>(appConfig.KEY);
  setupSwagger(app, {
    version: config.version || '0.0.0',
    enabled: config.swagger.enabled,
  });
  await app.listen(config.port, config.address);
  if (options?.logger !== false) {
    const logger = app.get(Logger);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  }
  return app;
};
