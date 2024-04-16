import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { iqAirConfig as iqac } from '@config/iqair.config';
import { type UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '@resources/twilio/services';
import {
  AirQualityDescriptions,
  MainPollutants,
  WeatherTypes,
  WindDirectionDescriptions,
  WindSpeedDescriptions,
} from '@resources/iqair/iqair.constants';
import { type IqAirDto, type IqAirValueDescription } from '../contracts';

@Injectable()
export class IqAirService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(iqac.KEY)
    private readonly iqAirConfig: ConfigType<typeof iqac>,
    private readonly twilioService: TwilioService,
  ) {}

  public async notifyAboutWeatherByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Weather in ${data.city}: is ${
        WeatherTypes[data.weather.weather_icon_code]
      }`,
    );
  }

  public async notifyAboutWindSpeedByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);
    const windSpeed = data.weather.wind_speed;
    const windDirection = data.weather.wind_direction;

    const speedDescription = this.retrieveDescription(
      WindSpeedDescriptions,
      windSpeed,
    );
    const directionDescription = this.retrieveDescription(
      WindDirectionDescriptions,
      windDirection,
    );

    return await this.twilioService.notify(
      user.phone_number,
      `Wind speed in ${data.city} is ${windSpeed} m/s\n` +
        (speedDescription ?? '') +
        directionDescription
        ? `\nThe wind direction is ${directionDescription}`
        : '',
    );
  }

  public async notifyAboutHumidityByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Humidity in ${data.city} is ${data.weather.humidity}%`,
    );
  }

  public async notifyAboutAtmosphericPressureByUser(
    user: UserRecord,
  ): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Atmospheric Pressure in ${data.city} is ${data.weather.atmospheric_pressure} hPa`,
    );
  }

  public async notifyAboutAirTemperatureByUser(
    user: UserRecord,
  ): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Air temperature in ${data.city} is ${data.pollution.aqi_value} degree Celsius`,
    );
  }

  public async notifyAboutAirQualityByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);
    const airQuality = data.pollution.aqi_value;

    const description = this.retrieveDescription(
      AirQualityDescriptions,
      airQuality,
    );

    return await this.twilioService.notify(
      user.phone_number,
      `Air quality in ${data.city} is ${airQuality}\n` +
        (description ?? '') +
        `\nThe main pollutant is ${
          MainPollutants[data.pollution.main_pollutant]
        }`,
    );
  }

  private retrieveDescription(
    collection: IqAirValueDescription[],
    value: number,
  ): string | undefined {
    return collection.find((description) => {
      return (
        (!description.lower_border || value >= description.lower_border) &&
        (!description.upper_border || value <= description.upper_border)
      );
    })?.description;
  }

  private async retrieveForUser(user: UserRecord): Promise<IqAirDto> {
    const latitude = user.current_latitude ?? user.default_latitude;
    const longitude = user.current_longitude ?? user.default_longitude;

    return this.retrieveByCoordinates(latitude, longitude);
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
