import { type Static, Type } from '@sinclair/typebox';
import { auth0EventUserDtoSchema } from './auth0-event-user-dto.schema';

export const auth0AuthorisationBodyDtoSchema = Type.Object(
  {
    code: Type.String(),
  },
  { additionalProperties: false },
);

export type Auth0AuthorisationBodyDto = Static<
  typeof auth0AuthorisationBodyDtoSchema
>;

export const auth0EventAuthenticationMethodSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const auth0EventAuthenticationSchema = Type.Object(
  {
    methods: Type.Optional(Type.Array(auth0EventAuthenticationMethodSchema)),
  },
  { additionalProperties: false },
);

export const auth0EventAuthorizationSchema = Type.Object(
  {
    roles: Type.Optional(Type.Array(Type.String())),
  },
  { additionalProperties: false },
);

export const auth0EventClientSchema = Type.Object(
  {
    client_id: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const auth0EventConnectionSchema = Type.Object(
  {
    id: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Object({})),
    name: Type.Optional(Type.String()),
    strategy: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const auth0EventOrganizationSchema = Type.Object(
  {
    display_name: Type.Optional(Type.String()),
    id: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Object({})),
    name: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const auth0EventRequestSchema = Type.Object(
  {
    body: Type.Optional(Type.Object({})),
    geoip: Type.Optional(
      Type.Object(
        {
          cityName: Type.Optional(Type.String()),
          continentCode: Type.Optional(Type.String()),
          countryCode: Type.Optional(Type.String()),
          countryCode3: Type.Optional(Type.String()),
          countryName: Type.Optional(Type.String()),
          latitude: Type.Optional(Type.Number()),
          longitude: Type.Optional(Type.Number()),
          timeZone: Type.Optional(Type.String()),
        },
        { additionalProperties: false },
      ),
    ),
    hostname: Type.Optional(Type.String()),
    ip: Type.Optional(Type.String()),
    language: Type.Optional(Type.String()),
    method: Type.Optional(Type.String()),
    query: Type.Optional(Type.Object({})),
    user_agent: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const auth0EventResourceServerSchema = Type.Object(
  {
    identifier: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const auth0EventStatsSchema = Type.Object(
  { logins_count: Type.Optional(Type.Number()) },
  { additionalProperties: false },
);

export const auth0EventTenantSchema = Type.Object(
  { id: Type.Optional(Type.String()) },
  { additionalProperties: false },
);

export const auth0EventTransactionSchema = Type.Object(
  {
    acr_values: Type.Optional(Type.Array(Type.String())),
    locale: Type.Optional(Type.String()),
    protocol: Type.Optional(Type.String()),
    requested_scopes: Type.Optional(Type.Array(Type.String())),
    ui_locales: Type.Optional(Type.Array(Type.String())),
  },
  { additionalProperties: false },
);

export const auth0EventLoginBodyDtoSchema = Type.Object(
  {
    authentication: Type.Optional(auth0EventAuthenticationSchema),
    authorization: Type.Optional(auth0EventAuthorizationSchema),
    client: auth0EventClientSchema,
    connection: auth0EventConnectionSchema,
    organization: Type.Optional(auth0EventOrganizationSchema),
    request: auth0EventRequestSchema,
    resource_server: Type.Optional(auth0EventResourceServerSchema),
    stats: auth0EventStatsSchema,
    tenant: auth0EventTenantSchema,
    transaction: Type.Optional(auth0EventTransactionSchema),
    user: auth0EventUserDtoSchema,
  },
  { additionalProperties: false },
);
export type Auth0EventLoginBodyDto = Static<
  typeof auth0EventLoginBodyDtoSchema
>;

export const auth0EventPreUserRegistrationBodyDtoSchema = Type.Object(
  {
    client: Type.Optional(auth0EventClientSchema),
    connection: auth0EventConnectionSchema,
    request: auth0EventRequestSchema,
    tenant: auth0EventTenantSchema,
    transaction: Type.Optional(auth0EventTransactionSchema),
    user: auth0EventUserDtoSchema,
  },
  { additionalProperties: false },
);

export type Auth0EventPreUserRegistrationBodyDto = Static<
  typeof auth0EventPreUserRegistrationBodyDtoSchema
>;

export const preUserRegistrationBodyDtoSchema = Type.Object(
  {
    event: Type.Optional(auth0EventPreUserRegistrationBodyDtoSchema),
  },
  { additionalProperties: false },
);

export const linkAccountsBodyDtoSchema = Type.Object(
  {
    event: auth0EventLoginBodyDtoSchema,
    secondary_access_token: Type.String(),
  },
  { additionalProperties: false },
);

export const signupBodyDtoSchema = Type.Object(
  {
    event: auth0EventLoginBodyDtoSchema,
  },
  { additionalProperties: false },
);

export type Auth0EventPostUserRegistrationBodyDto = Static<
  typeof auth0EventLoginBodyDtoSchema
>;

export const postLoginBodyDtoSchema = Type.Object(
  {
    event: auth0EventLoginBodyDtoSchema,
  },
  { additionalProperties: false },
);
