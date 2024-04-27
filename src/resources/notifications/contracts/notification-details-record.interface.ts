import { type IUserRecordResource } from '@resources/user/interfaces';
import { type Nullable } from '@lib/interfaces';

export interface UpdateNotificationDetailsPayload {
  lower_border?: Nullable<number>;
  upper_border?: Nullable<number>;
  trigger_value?: Nullable<number>;
  lower_border_active?: boolean;
  upper_border_active?: boolean;
  default_location?: boolean;
  active?: boolean;
  alert_in_progress?: boolean;
}

export interface CreateNotificationDetailsPayload {
  user: string;
  type: string;
  default_location?: boolean;
  active?: boolean;
  lower_border?: Nullable<number>;
  upper_border?: Nullable<number>;
  trigger_value?: Nullable<number>;
  lower_border_active?: boolean;
  upper_border_active?: boolean;
}

export interface NotificationDetailsRecord extends IUserRecordResource {
  type: string;
  lower_border: Nullable<number>;
  upper_border: Nullable<number>;
  trigger_value: Nullable<number>;
  lower_border_active: boolean;
  upper_border_active: boolean;
  default_location: boolean;
  active: boolean;
  alert_in_progress: boolean;
}
