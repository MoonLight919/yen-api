import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { iqAirConfig as iqac } from '@config/iqair.config';
import { type UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '@resources/twilio/services';
import { MainPollutants } from '@resources/iqair/iqair.constants';
import { type IqAirDto } from '../contracts';

@Injectable()
export class IqAirService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(iqac.KEY)
    private readonly iqAirConfig: ConfigType<typeof iqac>,
    private readonly twilioService: TwilioService,
  ) {}

  public async notifyAboutAirQualityByUser(user: UserRecord): Promise<void> {
    const latitude = user.current_latitude ?? user.default_latitude;
    const longitude = user.current_longitude ?? user.default_longitude;

    const data = await this.retrieveByCoordinates(latitude, longitude);

    return await this.twilioService.notify(
      user.phone_number,
      `Air quality in ${data.city} is ${data.pollution.aqi_value}\n` +
        `The main pollutant is ${
          MainPollutants[data.pollution.main_pollutant]
        }`,
    );
  }

  private async retrieveByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<IqAirDto> {
    const response = await this.httpService
      .get(`${this.iqAirConfig.baseUrl as string}/nearest_city`, {
        params: {
          key: this.iqAirConfig.apiKey,
          lat: latitude,
          lon: longitude,
        },
      })
      .toPromise();
    if (!response) {
      throw new Error(`Post request to ${this.iqAirConfig.baseUrl} failed`);
    }
    const { data: httpResponseData } = response;
    const responseData = httpResponseData.data.current;

    return {
      city: httpResponseData.data.city,
      pollution: {
        aqi_value: responseData.pollution.aqius,
        main_pollutant: responseData.pollution.mainus,
      },
      weather: {
        temperature: responseData.weather.tp,
        atmospheric_pressure: responseData.weather.pr,
        humidity: responseData.weather.hu,
        wind_speed: responseData.weather.ws,
        wind_direction: responseData.weather.wd,
        weather_icon_code: responseData.weather.ic,
      },
    };
  }
}
