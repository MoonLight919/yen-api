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
import { AlertsInUaService } from '@resources/alerts-in-ua/services';
import {
  NotificationDetailsService,
  NotificationService,
} from '@resources/notifications/services';
import { NotificationsModule } from '@resources/notifications/notifications.module';
import { NotificationTypes } from '@resources/notifications/notifications.constants';
import { TwilioService } from '@resources/twilio/services';
import { UserService } from '@resources/user/services';
import { IqAirService } from '@resources/iqair/services';
import { SaveEcoBotService } from '@resources/save-eco-bot/services';
import { buildApplication } from '../../core/lib/application';
import { insertRandomUserWithAuth0Sub } from '../../core/seeds';
import { clearAll } from '../../core/lib/database/repositories';
import { insertRandomNotificationDetails } from '../../core/seeds/notification-details.seed';
import { selectNotificationDetailsBy } from '../../core/selects';

describe('NotificationService', () => {
  let testUser: UserRecord;
  let app: NestFastifyApplication;
  let notificationService: NotificationService;
  let retrieveMethodSpy: SpyInstance;
  let notifySpy: SpyInstance;

  beforeAll(async () => {
    app = await buildApplication({
      imports: [NotificationsModule],
    });
  });

  beforeEach(async () => {
    const userData = await insertRandomUserWithAuth0Sub();
    testUser = userData.user;
    const alertsInUaService = app.get(AlertsInUaService);
    const notificationDetailsService = app.get(NotificationDetailsService);
    const twilioService = app.get(TwilioService);
    notificationService = new NotificationService(
      vi.fn().mockImplementation(() => {}),
      notificationDetailsService,
      app.get(UserService),
      alertsInUaService,
      app.get(IqAirService),
      app.get(SaveEcoBotService),
    );
    retrieveMethodSpy = vi.spyOn(alertsInUaService, 'retrieve');
    notifySpy = vi.spyOn(twilioService, 'notify');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await clearAll();
    await app.close();
  });

  describe('notifyAlertsInUA method', () => {
    beforeEach(() => {
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
    });

    it('should initiate an alert', async () => {
      const notificationDetails = await insertRandomNotificationDetails(
        testUser.id,
        {
          type: NotificationTypes.ALERT_IN_UA,
          active: true,
          default_location: true,
          alert_in_progress: false,
        },
      );

      testUser.default_region = 'Dnipropetrovsk';

      await notificationService.notifyAlertsInUA(
        [testUser],
        [notificationDetails],
      );

      const updatedNotificationDetails = await selectNotificationDetailsBy({
        id: notificationDetails.id,
      });

      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(updatedNotificationDetails.alert_in_progress).toStrictEqual(true);
    });

    it('should not initiate an alert if no alerts in the region', async () => {
      const notificationDetails = await insertRandomNotificationDetails(
        testUser.id,
        {
          type: NotificationTypes.ALERT_IN_UA,
          active: true,
          default_location: true,
          alert_in_progress: false,
        },
      );

      testUser.default_region = 'Kyiv City';

      await notificationService.notifyAlertsInUA(
        [testUser],
        [notificationDetails],
      );

      const updatedNotificationDetails = await selectNotificationDetailsBy({
        id: notificationDetails.id,
      });

      expect(notifySpy).toHaveBeenCalledTimes(0);
      expect(updatedNotificationDetails.alert_in_progress).toStrictEqual(false);
    });

    it('should not initiate an alert if alert is already issued an currently active', async () => {
      const notificationDetails = await insertRandomNotificationDetails(
        testUser.id,
        {
          type: NotificationTypes.ALERT_IN_UA,
          active: true,
          default_location: true,
          alert_in_progress: true,
        },
      );

      testUser.default_region = 'Dnipropetrovsk';

      await notificationService.notifyAlertsInUA(
        [testUser],
        [notificationDetails],
      );

      const updatedNotificationDetails = await selectNotificationDetailsBy({
        id: notificationDetails.id,
      });

      expect(notifySpy).toHaveBeenCalledTimes(0);
      expect(updatedNotificationDetails.alert_in_progress).toStrictEqual(true);
    });

    it('should set alert_in_progress to false if alert is active anymore, but used to', async () => {
      const notificationDetails = await insertRandomNotificationDetails(
        testUser.id,
        {
          type: NotificationTypes.ALERT_IN_UA,
          active: true,
          default_location: true,
          alert_in_progress: true,
        },
      );

      testUser.default_region = 'Kyiv City';

      await notificationService.notifyAlertsInUA(
        [testUser],
        [notificationDetails],
      );

      const updatedNotificationDetails = await selectNotificationDetailsBy({
        id: notificationDetails.id,
      });

      expect(notifySpy).toHaveBeenCalledTimes(0);
      expect(updatedNotificationDetails.alert_in_progress).toStrictEqual(false);
    });
  });
});
