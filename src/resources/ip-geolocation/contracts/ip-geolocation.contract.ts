import { Type, type Static } from '@sinclair/typebox';

export const ipGeolocationDto = Type.Object(
  {
    ip_address: Type.String(),
    city: Type.String(),
    region: Type.String(),
    postal_code: Type.String(),
    country: Type.String(),
    continent: Type.String(),
    longitude: Type.Number(),
    latitude: Type.Number(),
    timezone: Type.String(),
    flag_url: Type.String(),
  },
  { additionalProperties: false },
);
export type IpGeolocationDto = Static<typeof ipGeolocationDto>;
