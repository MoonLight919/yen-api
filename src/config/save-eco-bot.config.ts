import { registerAs, type ConfigType } from '@nestjs/config';

export const saveEcoBotConfig = registerAs('save-eco-bot', () => {
  return {
    baseUrl: process.env.SAVE_ECO_BOT_BASE_URL,
    apiKey: process.env.SAVE_ECO_BOT_API_KEY,
  };
});

export type SaveEcoBotConfig = ConfigType<typeof saveEcoBotConfig>;
