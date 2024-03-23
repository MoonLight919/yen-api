import { stringify as qsStringify } from 'qs';
import {
  type Response as LightMyRequestResponse,
  type InjectOptions,
} from 'light-my-request';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';

export interface HttpRequestOptions extends Omit<InjectOptions, 'query'> {
  jwt?: string | null;
  query?: Record<string, unknown>;
}

export type HttpRequestResult<T> = Promise<{
  response: LightMyRequestResponse;
  payload: T;
}>;

export type HttpRequest = <T>(
  path: string,
  options?: HttpRequestOptions,
) => HttpRequestResult<T>;

const valueOrUndefined = <T>(
  val: T,
  parentVal: T | undefined,
): T | undefined => {
  if (val === null) {
    return undefined;
  }
  return val ?? parentVal;
};

export const buildHttpRequest = (
  app: NestFastifyApplication,
  parentOptions?: HttpRequestOptions,
): HttpRequest => {
  return async <T>(
    path: string,
    options: HttpRequestOptions = {},
  ): HttpRequestResult<T> => {
    // eslint-disable-next-line prefer-const
    let { jwt, payload, headers = {}, ...otherOptions } = options;
    const { query, method = 'GET', ...injectOptions } = otherOptions;
    jwt = valueOrUndefined(jwt, parentOptions?.jwt);
    if (typeof payload === 'object') {
      headers = {
        ...headers,
        'content-type': 'application/json',
      };
      payload = JSON.stringify(payload);
    }
    if (typeof query === 'object') {
      path = `${path}?${qsStringify(query)}`;
    }
    if (jwt) {
      headers = {
        ...headers,
        authorization: `Bearer ${jwt}`,
      };
    }

    headers = {
      ...headers,
      ...(parentOptions?.headers || {}),
    };
    const response = await app.inject({
      path,
      method,
      headers,
      payload,
      ...injectOptions,
    });
    if (!response.payload) {
      return {
        response,
        payload: response.payload as unknown as T,
      };
    }
    const [responseContentType] = (
      response.headers['content-type'] as string
    ).split(';');
    return {
      response,
      payload: (responseContentType === 'application/json'
        ? response.json()
        : response.payload) as T,
    };
  };
};
