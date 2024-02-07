import { expect } from 'vitest';
import { type Response as LightMyRequestResponse } from 'light-my-request';

export const expectStatusCode = (
  response: LightMyRequestResponse,
  statusCode: number,
): Chai.Assertion => {
  return expect(response.statusCode).eq(
    statusCode,
    response.headers['content-type']?.toString().includes('application/json')
      ? `${response.raw.req.url} : ${JSON.stringify(response.json(), null, 2)}`
      : undefined,
  );
};

export const expectErrorCode = <T = { code: string }>(
  payload: T,
  code: string,
): Chai.Assertion => expect(payload).property('code').eq(code);
