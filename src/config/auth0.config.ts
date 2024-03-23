import { registerAs, type ConfigType } from '@nestjs/config';

export const auth0Config = registerAs('auth0', () => {
  return {
    domain: process.env.AUTH0_DOMAIN,
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    redirect_url: process.env.AUTH0_REDIRECT_URL,
    hooks: {
      apiKey: process.env.AUTH0_HOOKS_API_KEY ?? 'test',
    },
  };
});

export type Auth0Config = ConfigType<typeof auth0Config>;
