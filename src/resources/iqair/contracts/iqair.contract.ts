import { Type, type Static } from '@sinclair/typebox';

export interface IqAirValueDescription {
  lower_border?: number;
  upper_border?: number;
  description: string;
}

export const iqAirDtoSchema = Type.Object(
  {
    city: Type.String(),
    pollution: Type.Object({
      aqi_value: Type.Number(),
      main_pollutant: Type.String(),
    }),
    weather: Type.Object({
      temperature: Type.Number(),
      atmospheric_pressure: Type.Number(),
      humidity: Type.Number(),
      wind_speed: Type.Number(),
      wind_direction: Type.Number(),
      weather_icon_code: Type.String(),
    }),
  },
  {
    additionalProperties: false,
    $id: 'IqAir',
  },
);
export type IqAirDto = Static<typeof iqAirDtoSchema>;
