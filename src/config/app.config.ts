import { registerAs, type ConfigType } from '@nestjs/config';
import {
  readPackageJson,
  parseRuntimeBuildInfo,
  coerceStringToBoolean,
} from '@utils';

export const appConfig = registerAs('app', () => {
  const packageJson = readPackageJson();
  const runtimeBuildInfo = parseRuntimeBuildInfo();

  return {
    name: `${packageJson.name}@${packageJson.version}`,
    port: +(process.env.PORT ?? 3000),
    address: process.env.ADDRESS ?? 'localhost',
    origin: process.env.APP_ORIGIN ?? 'http://localhost:3000',
    webOrigin: process.env.APP_WEB_ORIGIN ?? 'http://localhost:8000',
    version: packageJson.version as string,
    commitShortSha: runtimeBuildInfo.commitShortSha,
    swagger: {
      enabled: coerceStringToBoolean(process.env.APP_SWAGGER_ENABLED) ?? false,
    },
    logger: {
      enabled: true,
      redact: [
        'req.headers.authorization',
        'req.query.jwt',
        'req.headers["x-api-key"]',
      ],
      mixin: () => ({ context: 'Ingress', version: packageJson.version }),
      extremeMode: {
        enabled:
          coerceStringToBoolean(process.env.APP_LOGGER_EXTREME_MODE_ENABLED) ??
          false,
        minLength: +(process.env.APP_LOGGER_EXTREME_MODE_MIN_LENGTH ?? 4096),
      },
    },
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
