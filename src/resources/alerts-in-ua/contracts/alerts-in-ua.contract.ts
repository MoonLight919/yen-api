import { type Nullable } from '@lib/interfaces';

export interface AlertsInUaDto {
  type: string;
  location: string;
  region: string;
  area: Nullable<string>;
}

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
  notes: string | null;
  calculated: boolean | null;
  location_oblast_uid: number;
  location_raion?: string;
}
