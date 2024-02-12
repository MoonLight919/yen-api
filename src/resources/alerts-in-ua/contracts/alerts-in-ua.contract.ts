import { Type, type Static } from '@sinclair/typebox';

export const alertDtoSchema = Type.Object(
  {
    location: Type.String(),
    started_at: Type.String(),
  },
  {
    additionalProperties: false,
    $id: 'alerts-in-ua',
  },
);
export type AlertDto = Static<typeof alertDtoSchema>;

export const alertsInUaDtoSchema = Type.Array(alertDtoSchema, {
  additionalProperties: false,
  $id: 'alerts-in-ua',
});
export type AlertsInUaDto = Static<typeof alertsInUaDtoSchema>;

export interface Alert {
  id: number;
  location_title: string;
  location_type: string;
  started_at: string;
  finished_at: string;
  updated_at: string;
  alert_type: string;
  location_oblast: string;
  location_uid: string;
  notes: string;
  calculated: boolean | null;
  location_oblast_uid: number;
}
