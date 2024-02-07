import type { ResourceObject } from '../schemas';

export type DefaultResourceFields =
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'object';

export type OmitDefaultResourceFields<T> = T extends ResourceObject
  ? Omit<T, DefaultResourceFields>
  : T;
