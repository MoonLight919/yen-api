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
import { TwilioService } from '@resources/twilio/services';
import { IqAirService } from '@resources/iqair/services';
import { IqAirModule } from '@resources/iqair/iqair.module';
import {
  AirQualityDescriptions,
  WindSpeedDescriptions,
} from '@resources/iqair/iqair.constants';
import { buildApplication } from '../core/lib/application';
import { insertRandomUserWithAuth0Sub } from '../core/seeds';
import { clearAll } from '../core/lib/database/repositories';

describe('IqAirService', () => {
  let testUser: UserRecord;
  let app: NestFastifyApplication;
  let iqAirService: IqAirService;
  let retrieveForUserMethodSpy: SpyInstance;
  let notifySpy: SpyInstance;

  beforeAll(async () => {
    app = await buildApplication({
      imports: [IqAirModule],
    });
  });

  beforeEach(async () => {
    const userData = await insertRandomUserWithAuth0Sub();
    testUser = userData.user;
    const twilioService = app.get(TwilioService);
    notifySpy = vi.spyOn(twilioService, 'notify');
    iqAirService = new IqAirService(
      vi.fn().mockImplementation(() => {}),
      vi.fn().mockImplementation(() => {}),
      twilioService,
    );
    retrieveForUserMethodSpy = vi.spyOn(iqAirService, 'retrieveForUser');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await clearAll();
    await app.close();
  });

  describe('notifyAboutAirQualityByUser method', () => {
    it('should construct a generic notification body', async () => {
      retrieveForUserMethodSpy.mockResolvedValueOnce({
        city: 'Kyiv',
        pollution: {
          aqi_value: 12,
          main_pollutant: 'p2',
        },
        weather: {
          temperature: 11,
          atmospheric_pressure: 997,
          humidity: 62,
          wind_speed: 0.45,
          wind_direction: 226,
          weather_icon_code: '04d',
        },
      });

      await iqAirService.notifyAboutAirQualityByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Air quality in Kyiv is 12\n' +
          AirQualityDescriptions[0].description +
          '\nThe main pollutant is pm2.5',
      );
    });

    it('should construct a notification body with an extreme value', async () => {
      retrieveForUserMethodSpy.mockResolvedValueOnce({
        city: 'Kyiv',
        pollution: {
          aqi_value: 500,
          main_pollutant: 'p2',
        },
        weather: {
          temperature: 11,
          atmospheric_pressure: 997,
          humidity: 62,
          wind_speed: 0.45,
          wind_direction: 226,
          weather_icon_code: '04d',
        },
      });

      await iqAirService.notifyAboutAirQualityByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Air quality in Kyiv is 500\n' +
          AirQualityDescriptions[AirQualityDescriptions.length - 1]
            .description +
          '\nThe main pollutant is pm2.5',
      );
    });
  });

  describe('notifyAboutWindSpeedByUser method', () => {
    it('should construct a generic notification body', async () => {
      retrieveForUserMethodSpy.mockResolvedValueOnce({
        city: 'Kyiv',
        pollution: {
          aqi_value: 12,
          main_pollutant: 'p2',
        },
        weather: {
          temperature: 11,
          atmospheric_pressure: 997,
          humidity: 62,
          wind_speed: 0.45,
          wind_direction: 226,
          weather_icon_code: '04d',
        },
      });

      await iqAirService.notifyAboutWindSpeedByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Wind speed in Kyiv is 0.45 m/s\n' +
          WindSpeedDescriptions[1].description +
          '\nThe wind direction is West',
      );
    });

    it('should construct a notification body with an extreme value', async () => {
      retrieveForUserMethodSpy.mockResolvedValueOnce({
        city: 'Kyiv',
        pollution: {
          aqi_value: 12,
          main_pollutant: 'p2',
        },
        weather: {
          temperature: 11,
          atmospheric_pressure: 997,
          humidity: 62,
          wind_speed: 0,
          wind_direction: 226,
          weather_icon_code: '04d',
        },
      });

      await iqAirService.notifyAboutWindSpeedByUser(testUser);

      expect(notifySpy).toHaveBeenCalledWith(
        testUser.phone_number,
        'Wind speed in Kyiv is 0 m/s\n' +
          WindSpeedDescriptions[0].description +
          '\nThe wind direction is West',
      );
    });
  });
});
