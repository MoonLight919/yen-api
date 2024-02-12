import { registerAs, type ConfigType } from '@nestjs/config';

export const iqAirConfig = registerAs('iqair', () => {
  return {
    baseUrl: process.env.IQAIR_BASE_URL,
    apiKey: process.env.IQAIR_API_KEY,
  };
});

export type IqAirConfig = ConfigType<typeof iqAirConfig>;
