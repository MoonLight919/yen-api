import { Test, type TestingModuleBuilder } from '@nestjs/testing';
import { ConfigService, getConfigToken } from '@nestjs/config';
import { mergeDeep, prop } from '@utils';
import { ConfigModule } from '@modules/config/config.module';
import { generateDatabaseConnectionOptions } from '../lib/database/knex';

const defaultConfig = {
  features: {
    auth: true,
    mail: false,
    analytics: false,
    channel_webhook_verify: false,
    channels: {
      twilio: true,
    },
  },
  db: {
    connection: generateDatabaseConnectionOptions(),
    pool: {
      min: 1,
      max: 2,
    },
    asyncStackTraces: true,
  },
};

class MockConfigService {
  constructor(private readonly config: Record<string, unknown>) {}
  public get<T extends string>(path: string, defaultValue: unknown): T {
    return prop<T>(path)(this.config) ?? defaultValue;
  }
}

export const mockConfig = async (
  appModule: TestingModuleBuilder,
  overrideConfig: Record<string, unknown> = {},
): Promise<void> => {
  const finalConfig = {
    ...defaultConfig,
    ...overrideConfig,
  };

  appModule
    .overrideProvider(ConfigService)
    .useValue(new MockConfigService(finalConfig));

  const compiledConfigModule = await Test.createTestingModule({
    imports: [ConfigModule],
  }).compile();

  Object.entries(finalConfig).forEach(([namespace, config]) => {
    const existingConfig = compiledConfigModule.get(getConfigToken(namespace));
    appModule
      .overrideProvider(getConfigToken(namespace))
      .useValue(mergeDeep(existingConfig, config));
  });
};
