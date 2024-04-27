import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { saveEcoBotConfig as sebc } from '@config/save-eco-bot.config';
import { type UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '@resources/twilio/services';
import { type NotificationDetailsRecord } from '@resources/notifications/contracts';
import { retrieveDescription } from '@utils';
import {
  type RadiationDataDto,
  type RadiationInformationDto,
  type RadiationMonitoringStationDto,
  type SensorsData,
  type SensorsDetails,
} from '../contracts';
import { RadiationLevelDescriptions } from '../save-eco-bot.constants';
import { getNearestCoordinates } from '../utils/get-nearest-coordinates';

@Injectable()
export class SaveEcoBotService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(sebc.KEY)
    private readonly saveEcoBotConfig: ConfigType<typeof sebc>,
    private readonly twilioService: TwilioService,
  ) {}

  public async alertAboutRadiation(
    notificationDetail: NotificationDetailsRecord,
    apiData: RadiationInformationDto,
    phoneNumber: string,
  ): Promise<boolean> {
    const lowerBorderExceeded =
      notificationDetail.lower_border_active &&
      notificationDetail.lower_border &&
      notificationDetail.lower_border >= apiData.gamma_nsv_h;

    const upperBorderExceeded =
      notificationDetail.upper_border_active &&
      notificationDetail.upper_border &&
      notificationDetail.upper_border <= apiData.gamma_nsv_h;

    if (lowerBorderExceeded || upperBorderExceeded) {
      if (notificationDetail.alert_in_progress) {
        return false;
      }

      const gammaLevel = apiData.gamma_nsv_h;
      const gammaLevelDescription = retrieveDescription(
        RadiationLevelDescriptions,
        gammaLevel,
      );

      const messageBody =
        `Current radiation state\n\n` +
        `Gamma level: ${gammaLevel} nSv/h - ${gammaLevelDescription}\n` +
        `Sensor address: ${apiData.sensor_name}, ${apiData.region_name}, ` +
        `${apiData.city_name}\n` +
        `Sensor owner: ${apiData.platform_name}` +
        (apiData.notes ? `\n${apiData.notes}` : '');

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Radiation alert from Yenebezpeka!\n` + messageBody,
      );

      return true;
    }

    return false;
  }

  public async notifyByUser(user: UserRecord): Promise<void> {
    const radiationInformation = await this.retrieveForUser(user);
    const gammaLevel = radiationInformation.gamma_nsv_h;
    const gammaLevelDescription = retrieveDescription(
      RadiationLevelDescriptions,
      gammaLevel,
    );

    const messageBody =
      `Current radiation state\n\n` +
      `Gamma level: ${gammaLevel} nSv/h - ${gammaLevelDescription}\n` +
      `Sensor address: ${radiationInformation.sensor_name}, ${radiationInformation.region_name}, ` +
      `${radiationInformation.city_name}\n` +
      `Sensor owner: ${radiationInformation.platform_name}` +
      (radiationInformation.notes ? `\n${radiationInformation.notes}` : '');

    return this.twilioService.notify(user.phone_number, messageBody);
  }

  public async retrieveByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<RadiationInformationDto> {
    const stations = await this.retrieveRadiationMonitoringStation();
    const nearestStation = getNearestCoordinates(
      {
        latitude,
        longitude,
      },
      stations.map((station) => ({
        latitude: parseFloat(station.latitude),
        longitude: parseFloat(station.longitude),
        payload: station,
      })),
    ).payload;

    if (!nearestStation) {
      throw new Error('Nearest station not found');
    }

    const radiationData = await this.retrieveRadiationData();
    const nearestStationRadiationData = radiationData.find(
      (data) => data.sensor_id === nearestStation.sensor_id,
    );

    if (!nearestStationRadiationData) {
      throw new Error('Nearest station not found');
    }

    return {
      ...nearestStation,
      gamma_nsv_h: nearestStationRadiationData.gamma_nsv_h,
    };
  }

  public async retrieveRadiationData(): Promise<RadiationDataDto[]> {
    const response = await this.httpService
      .get(
        `${
          this.saveEcoBotConfig.baseUrl as string
        }/sensors-last-data?filter[language]=en`,
        {
          params: {
            apikey: this.saveEcoBotConfig.apiKey,
          },
        },
      )
      .toPromise();
    if (!response) {
      throw new Error(
        `Post request to ${this.saveEcoBotConfig.baseUrl} failed`,
      );
    }

    return response.data.data.map((station: SensorsData) => ({
      sensor_id: station.sensor_id,
      gamma_nsv_h: station.gamma_nsv_h,
    }));
  }

  public async retrieveRadiationMonitoringStation(): Promise<
    RadiationMonitoringStationDto[]
  > {
    const response = await this.httpService
      .get(
        `${
          this.saveEcoBotConfig.baseUrl as string
        }/sensors-details?filter[language]=en`,
        {
          params: {
            apikey: this.saveEcoBotConfig.apiKey,
          },
        },
      )
      .toPromise();
    if (!response) {
      throw new Error(
        `Post request to ${this.saveEcoBotConfig.baseUrl} failed`,
      );
    }

    return response.data.data.map((station: SensorsDetails) => ({
      sensor_id: station.sensor_id,
      sensor_name: station.sensor_name,
      latitude: station.latitude,
      longitude: station.longitude,
      region_name: station.region_name,
      location_type: station.city_type_name,
      city_name: station.city_name,
      platform_name: station.platform_name,
      notes: station.notes,
      url_maps: station.url_maps,
    }));
  }

  public async retrieveForUser(
    user: UserRecord,
  ): Promise<RadiationInformationDto> {
    const latitude = user.current_latitude ?? user.default_latitude;
    const longitude = user.current_longitude ?? user.default_longitude;

    return this.retrieveByCoordinates(latitude, longitude);
  }
}
