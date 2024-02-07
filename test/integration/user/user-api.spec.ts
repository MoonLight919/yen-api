import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { type UserRecord } from '@resources/user/interfaces';
import { UserModule } from '@resources/user/user.module';
import {
  insertRandomUserWithAuth0Sub,
} from '../../core/seeds';
import {
  buildHttpRequest,
  type HttpRequest,
} from '../../core/lib/http-request';
import { expectStatusCode } from '../../core/asserts';
import { buildApplication } from '../../core/lib/application';
import { clearAll } from '../../core/lib/database/repositories';

describe('User Profile API', () => {
  let request: HttpRequest;
  let testUser: UserRecord;
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await buildApplication({
      imports: [UserModule],
    });
  });
  beforeEach(async () => {
    const userData = await insertRandomUserWithAuth0Sub();
    testUser = userData.user;
    request = buildHttpRequest(app, { jwt: userData.token });
  });
  afterAll(async () => {
    await clearAll();
    await app.close();
  });

  describe('GET /profile', () => {
    it('should return profile data', async () => {
      const { response, payload } = await request('profile');
      expectStatusCode(response, 200);
      expect(payload)
        .property('user')
        .excluding(['sub', 'device_id'])
        .deep.eq(testUser);
    });
  });
});
