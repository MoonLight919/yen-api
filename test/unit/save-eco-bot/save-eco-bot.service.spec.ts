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
import { SaveEcoBotService } from '@resources/save-eco-bot/services';
import { SaveEcoBotModule } from '@resources/save-eco-bot/save-eco-bot.module';
import { buildApplication } from '../../core/lib/application';
import { insertRandomUserWithAuth0Sub } from '../../core/seeds';
import { clearAll } from '../../core/lib/database/repositories';
describe('SaveEcoBotService', () => {
  let testUser: UserRecord;
  let app: NestFastifyApplication;
  let saveEcoBotService: SaveEcoBotService;
  let retrieveRadiationMonitoringStationSpy: SpyInstance;
  let retrieveRadiationDataSpy: SpyInstance;

  beforeAll(async () => {
    app = await buildApplication({
      imports: [SaveEcoBotModule],
    });
  });

  beforeEach(async () => {
    const userData = await insertRandomUserWithAuth0Sub();
    testUser = userData.user;
    saveEcoBotService = new SaveEcoBotService(
      vi.fn().mockImplementation(() => {}),
      vi.fn().mockImplementation(() => {}),
      vi.fn().mockImplementation(() => {}),
    );
    retrieveRadiationMonitoringStationSpy = vi.spyOn(
      saveEcoBotService,
      'retrieveRadiationMonitoringStation',
    );
    retrieveRadiationDataSpy = vi.spyOn(
      saveEcoBotService,
      'retrieveRadiationData',
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await clearAll();
    await app.close();
  });

  describe('retrieveByCoordinates method', () => {
    it('should construct a notification body wit nearest monitoring station', async () => {
      retrieveRadiationMonitoringStationSpy.mockResolvedValueOnce([
        {
          sensor_id: 20539,
          sensor_name: 'DTEK Dobrotvirska TPP',
          latitude: '50.21469915788389',
          longitude: '24.37467361961421',
          region_name: 'Lviv Oblast',
          city_type_name: 'urban village',
          city_name: 'Dobrotvir',
          platform_name: 'DTEK',
          notes:
            'Manual measurements with the household radiometer RKS-20.03 "Pripyat"',
          url_maps:
            'https://www.saveecobot.com/radiation-maps#13/50.21469915788389/24.37467361961421',
        },
        {
          sensor_id: 20540,
          sensor_name: "DTEK Kryvoriz'ka TPP",
          latitude: '47.54263743198735',
          longitude: '33.658342853413465',
          region_name: 'Dnipropetrovsk Oblast',
          city_type_name: 'city',
          city_name: 'Zelenodolsk',
          platform_name: 'DTEK',
          notes:
            'Manual measurements with a portable device "STORA-TU" Dosimeter-Radiometer RKS-01',
          url_maps:
            'https://www.saveecobot.com/radiation-maps#13/47.54263743198735/33.658342853413465',
        },
        {
          sensor_id: 77,
          sensor_name: 'Street Kyivskyi Shliakh ,72',
          latitude: '50.35097',
          longitude: '30.94944',
          region_name: 'Kyiv Oblast',
          city_type_name: 'city',
          city_name: 'Boryspil',
          platform_name:
            'Department of Ecology and Natural Resources of Kyiv Regional State Administration',
          notes: null,
          url_maps:
            'https://www.saveecobot.com/radiation-maps#13/50.35097/30.94944',
        },
      ]);

      retrieveRadiationDataSpy.mockResolvedValueOnce([
        {
          sensor_id: 20539,
          gamma_nsv_h: 140,
        },
        {
          sensor_id: 20540,
          gamma_nsv_h: 160,
        },
        {
          sensor_id: 77,
          gamma_nsv_h: 100,
        },
      ]);

      testUser.default_longitude = 30.5303;
      testUser.default_latitude = 50.458;

      const result = await saveEcoBotService.retrieveByCoordinates(
        testUser.default_latitude,
        testUser.default_longitude,
      );

      expect(result).deep.eq({
        sensor_id: 77,
        sensor_name: 'Street Kyivskyi Shliakh ,72',
        latitude: '50.35097',
        longitude: '30.94944',
        region_name: 'Kyiv Oblast',
        city_type_name: 'city',
        city_name: 'Boryspil',
        platform_name:
          'Department of Ecology and Natural Resources of Kyiv Regional State Administration',
        notes: null,
        url_maps:
          'https://www.saveecobot.com/radiation-maps#13/50.35097/30.94944',
        gamma_nsv_h: 100,
      });
    });
  });
});
