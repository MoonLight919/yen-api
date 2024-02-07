import { describe, it, beforeEach, beforeAll, afterAll } from 'vitest';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AuthModule } from '@resources/auth/auth.module';
import { UserModule } from '@resources/user/user.module';
import { buildApplication } from '../../core/lib/application';
import {
  buildHttpRequest,
  type HttpRequest,
} from '../../core/lib/http-request';
import { expectStatusCode, expectErrorCode } from '../../core/asserts';
import { getMockJwt } from '../../core/mocks';
import { insertRandomUser } from '../../core/seeds';
import { clearAll } from '../../core/lib/database/repositories';
import {
  AuthControllerMethodMock,
  Auth0ControllerClassProtectedMock,
} from './mock';

describe('Auth0 guard', () => {
  let app: NestFastifyApplication;
  let request: HttpRequest;
  beforeAll(async () => {
    app = await buildApplication({
      imports: [AuthModule, UserModule],
      controllers: [
        AuthControllerMethodMock,
        Auth0ControllerClassProtectedMock,
      ],
    });
  });
  beforeEach(async () => {
    request = buildHttpRequest(app);
  });
  afterAll(async () => {
    await clearAll();
    await app.close();
  });

  describe('Class', () => {
    it('should return error not authenticated if no token are provided', async () => {
      const { response, payload } = await request<{ code: string }>(
        '/auth0-class/protected',
      );
      expectStatusCode(response, 401);
      expectErrorCode(payload, 'not_authenticated_request');
    });
    it('should allow request with authenticated token', async () => {
      const testUser = await insertRandomUser();
      const { response } = await request('/auth0-class/protected', {
        jwt: await getMockJwt(testUser.sub as string),
      });
      expectStatusCode(response, 200);
    });
  });

  describe('Methods', () => {
    it('should allow any request', async () => {
      const { response } = await request('/auth-method/allow');
      expectStatusCode(response, 200);
    });
    it('should allow request with authenticated token', async () => {
      const testUser = await insertRandomUser();
      const { response } = await request('/auth-method/auth0-protected', {
        jwt: await getMockJwt(testUser.sub as string),
      });
      expectStatusCode(response, 200);
    });
    it('should return error not authenticated if no token are provided', async () => {
      const { response, payload } = await request<{ code: string }>(
        '/auth-method/auth0-protected',
      );
      expectStatusCode(response, 401);
      expectErrorCode(payload, 'not_authenticated_request');
    });
  });
});
