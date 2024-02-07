import { type Scope } from '@sentry/types';
import { type FastifyRequest } from 'fastify';
import { type UserRecord } from '@resources/user/interfaces';
import { type MetadataContainer } from '../metadata';

export interface ApplicationFastifyRequest extends FastifyRequest {
  headers: Record<string, string>;
  params: Record<string, string>;
  metadata: MetadataContainer;
  sentryScope: Scope;
  user?: UserRecord;
}
