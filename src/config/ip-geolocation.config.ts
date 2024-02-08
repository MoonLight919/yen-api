import { registerAs, type ConfigType } from '@nestjs/config';

export const ipGeolocationConfig = registerAs('ip-geolocation', () => {
  return {
    baseUrl: process.env.IP_GEOLOCATION_BASE_URL,
    apiKey: process.env.IP_GEOLOCATION_API_KEY,
  };
});

export type IpGeolocationConfig = ConfigType<typeof ipGeolocationConfig>;
