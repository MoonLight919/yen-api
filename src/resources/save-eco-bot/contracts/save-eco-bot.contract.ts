import { Type, type Static } from '@sinclair/typebox';
import { nullable } from '@lib/schemas';
import { type Nullable } from '@lib/interfaces';

export interface SensorsDetails {
  sensor_id: number;
  sensor_name: string;
  latitude: string;
  longitude: string;
  region_name: string;
  city_type_name: string;
  city_name: string;
  platform_name: string;
  notes: Nullable<string>;
  url_maps: string;
}

export interface SensorsData {
  sensor_id: number;
  updated_at: string;
  gamma_nsv_h: number;
  is_old: number;
}

export interface CoordinatesWithPayload<T> {
  latitude: number;
  longitude: number;
  payload?: T;
}

export const radiationInformationDtoSchema = Type.Object(
  {
    sensor_name: Type.String(),
    region_name: Type.String(),
    city_type_name: Type.String(),
    city_name: Type.String(),
    platform_name: Type.String(),
    notes: nullable(Type.String()),
    url_maps: Type.String(),
    gamma_nsv_h: Type.Number(),
  },
  {
    additionalProperties: false,
    $id: 'radiationInformation',
  },
);
export type RadiationInformationDto = Static<
  typeof radiationInformationDtoSchema
>;

export const radiationDataDtoSchema = Type.Object(
  {
    sensor_id: Type.Number(),
    gamma_nsv_h: Type.Number(),
  },
  {
    additionalProperties: false,
    $id: 'radiationMonitoringStation',
  },
);
export type RadiationDataDto = Static<typeof radiationDataDtoSchema>;

export const radiationMonitoringStationDtoSchema = Type.Object(
  {
    sensor_id: Type.Number(),
    sensor_name: Type.String(),
    latitude: Type.String(),
    longitude: Type.String(),
    region_name: Type.String(),
    city_type_name: Type.String(),
    city_name: Type.String(),
    platform_name: Type.String(),
    notes: Type.String(),
    url_maps: Type.String(),
  },
  {
    additionalProperties: false,
    $id: 'radiationData',
  },
);
export type RadiationMonitoringStationDto = Static<
  typeof radiationMonitoringStationDtoSchema
>;
