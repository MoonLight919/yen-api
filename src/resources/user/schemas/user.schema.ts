import { Type } from '@sinclair/typebox';
import { extendResourceObject } from '@lib/db';
import { nullable } from '@lib/schemas';

export const userDtoSchema = extendResourceObject(
  Type.Object({
    phone_number: Type.String(),
    default_city: Type.String(),
    default_country: Type.String(),
    default_latitude: Type.Number(),
    default_longitude: Type.Number(),
    default_region: nullable(Type.String()),
    current_city: nullable(Type.String()),
    current_country: nullable(Type.String()),
    current_latitude: nullable(Type.Number()),
    current_longitude: nullable(Type.Number()),
    current_region: nullable(Type.String()),
    default_location_for_alerts_in_ua_notifications: Type.Boolean(),
    default_location_for_air_quality_and_weather_notifications: Type.Boolean(),
    default_location_for_radiation_level_notifications: Type.Boolean(),
  }),
  { $id: 'User' },
);
