import { registerAs, type ConfigType } from '@nestjs/config';

export const auth0Config = registerAs('auth0', () => {
  return {
    domain: process.env.AUTH0_DOMAIN,
    management: {
      domain: process.env.AUTH0_MANAGEMENT_DOMAIN,
      clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_MANAGEMENT_DOMAIN}/api/v2/`,
    },
    hooks: {
      apiKey: process.env.AUTH0_HOOKS_API_KEY ?? 'test',
    },
  };
});

export type Auth0Config = ConfigType<typeof auth0Config>;
