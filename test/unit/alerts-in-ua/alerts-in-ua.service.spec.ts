import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  type SpyInstance,
  afterEach,
} from 'vitest';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { type UserRecord } from '@resources/user/interfaces';
import { AlertsInUaModule } from '@resources/alerts-in-ua/alerts-in-ua.module';
import { AlertsInUaService } from '@resources/alerts-in-ua/services';
import { TwilioService } from '@resources/twilio/services';
import { buildApplication } from '../../core/lib/application';
import { insertRandomUserWithAuth0Sub } from '../../core/seeds';
import { clearAll } from '../../core/lib/database/repositories';

describe('AlertsInUaService', () => {
  let testUser: UserRecord;
  let app: NestFastifyApplication;
  let alertsInUaService: AlertsInUaService;
  let retrieveMethodSpy: SpyInstance;
  let notifySpy: SpyInstance;

  beforeAll(async () => {
    app = await buildApplication({
      imports: [AlertsInUaModule],
    });
  });

  beforeEach(async () => {
    const userData = await insertRandomUserWithAuth0Sub();
    testUser = userData.user;
    const twilioService = app.get(TwilioService);
    notifySpy = vi.spyOn(twilioService, 'notify');
    alertsInUaService = new AlertsInUaService(
      vi.fn().mockImplementation(() => {}),
      vi.fn().mockImplementation(() => {}),
      twilioService,
    );
    retrieveMethodSpy = vi.spyOn(alertsInUaService, 'retrieve');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await clearAll();
    await app.close();
  });

  describe('notifyByUser method', () => {
    it('should construct a notification body for the single alert', async () => {
      retrieveMethodSpy.mockResolvedValueOnce([
        {
          region: 'Луганська область',
          type: 'air_raid',
          location: 'Луганська область',
          area: null,
        },
      ]);

      testUser.default_region = 'Luhansk';

      await alertsInUaService.notifyByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Attention!\n\nAir raid alert in Луганська область',
      );
    });

    it('should construct a notification body for multiple alerts', async () => {
      retrieveMethodSpy.mockResolvedValueOnce([
        {
          region: 'Дніпропетровська область',
          type: 'artillery_shelling',
          location: 'м. Марганець',
          area: null,
        },
        {
          region: 'Дніпропетровська область',
          type: 'artillery_shelling',
          location: 'Марганецька територіальна громада',
          area: 'Нікопольський район',
        },
      ]);

      testUser.default_region = 'Dnipropetrovsk';

      await alertsInUaService.notifyByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Attention!' +
          '\n\nArtillery shelling alert in м. Марганець, Дніпропетровська область' +
          '\nArtillery shelling alert in Марганецька територіальна громада, Нікопольський район, Дніпропетровська область',
      );
    });

    it('should construct a notification body for the specific region', async () => {
      retrieveMethodSpy.mockResolvedValueOnce([
        {
          region: 'Луганська область',
          type: 'air_raid',
          location: 'Луганська область',
          area: null,
        },
        {
          region: 'Дніпропетровська область',
          type: 'artillery_shelling',
          location: 'Марганецька територіальна громада',
          area: 'Нікопольський район',
        },
        {
          region: 'Дніпропетровська область',
          type: 'air_raid',
          location: 'м. Дніпро',
          area: null,
        },
      ]);
      testUser.default_region = 'Dnipropetrovsk';

      await alertsInUaService.notifyByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Attention!' +
          '\n\nArtillery shelling alert in Марганецька територіальна громада, Нікопольський район, Дніпропетровська область' +
          '\nAir raid alert in м. Дніпро, Дніпропетровська область',
      );
    });

    it('should handle the absence of alerts while requesting information for the specific region', async () => {
      retrieveMethodSpy.mockResolvedValueOnce([
        {
          region: 'Луганська область',
          type: 'air_raid',
          location: 'Луганська область',
          area: null,
        },
        {
          region: 'Дніпропетровська область',
          type: 'artillery_shelling',
          location: 'Марганецька територіальна громада',
          area: 'Нікопольський район',
        },
        {
          region: 'Дніпропетровська область',
          type: 'air_raid',
          location: 'м. Дніпро',
          area: null,
        },
      ]);
      testUser.default_region = 'Kyiv City';

      await alertsInUaService.notifyByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'There are no alerts in your region',
      );
    });
  });
});
