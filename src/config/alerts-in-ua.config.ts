import { registerAs, type ConfigType } from '@nestjs/config';

export const alertsInUaConfig = registerAs('alerts-in-ua', () => {
  return {
    baseUrl: process.env.ALERTS_IN_UA_BASE_URL,
    apiKey: process.env.ALERTS_IN_UA_API_KEY,
  };
});

export type AlertsInUaConfig = ConfigType<typeof alertsInUaConfig>;
