import { type IUserRecordResource } from '@resources/user/interfaces';
import { type Nullable } from '@lib/interfaces';

export interface UpdateNotificationDetailsPayload {
  trigger_value?: Nullable<number>;
  default_location?: boolean;
  active?: boolean;
  alert_in_progress?: boolean;
}

export interface CreateNotificationDetailsPayload {
  user: string;
  type: string;
  default_location?: boolean;
  active?: boolean;
  trigger_value?: Nullable<number>;
}

export interface NotificationDetailsRecord extends IUserRecordResource {
  type: string;
  trigger_value: Nullable<number>;
  default_location: boolean;
  active: boolean;
  alert_in_progress: boolean;
}
