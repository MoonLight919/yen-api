import { registerAs, type ConfigType } from '@nestjs/config';

export const auth0Config = registerAs('auth0', () => {
  return {
    domain: process.env.AUTH0_DOMAIN,
    hooks: {
      apiKey: process.env.AUTH0_HOOKS_API_KEY ?? 'test',
    },
  };
});

export type Auth0Config = ConfigType<typeof auth0Config>;
