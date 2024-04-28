import { registerAs, type ConfigType } from '@nestjs/config';
import { coerceStringToBoolean } from '@utils';

export const featuresConfig = registerAs('features', () => ({
  auth: coerceStringToBoolean(process.env.FF_AUTH_ENABLED) ?? true,
  notifications:
    coerceStringToBoolean(process.env.FF_NOTIFICATIONS_ENABLED) ?? true,
}));

export type FeaturesConfig = ConfigType<typeof featuresConfig>;
