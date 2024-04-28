import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { iqAirConfig as iqac } from '@config/iqair.config';
import { type UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '@resources/twilio/services';
import { retrieveDescription } from '@utils';
import { type NotificationDetailsRecord } from '@resources/notifications/contracts';
import {
  AirQualityDescriptions,
  MainPollutants,
  WeatherTypes,
  WeatherValues,
  WindDirectionDescriptions,
  WindSpeedDescriptions,
} from '../iqair.constants';
import { type IqAirDto } from '../contracts';

@Injectable()
export class IqAirService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(iqac.KEY)
    private readonly iqAirConfig: ConfigType<typeof iqac>,
    private readonly twilioService: TwilioService,
  ) {}

  public async alertAboutWeather(
    notificationDetail: NotificationDetailsRecord,
    apiData: IqAirDto,
    phoneNumber: string,
  ): Promise<boolean> {
    if (
      notificationDetail.trigger_value &&
      WeatherValues[notificationDetail.trigger_value] ===
        apiData.weather.weather_icon_code
    ) {
      if (notificationDetail.alert_in_progress) {
        return true;
      }

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Weather alert from Yenebezpeka!\n` +
          `Weather in ${apiData.city}: ${
            WeatherTypes[apiData.weather.weather_icon_code]
          }`,
      );

      return true;
    }

    return false;
  }

  public async notifyAboutWeatherByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Weather in ${data.city}: ${
        WeatherTypes[data.weather.weather_icon_code]
      }`,
    );
  }

  public async alertAboutWindSpeed(
    notificationDetail: NotificationDetailsRecord,
    apiData: IqAirDto,
    phoneNumber: string,
  ): Promise<boolean> {
    const lowerBorderExceeded =
      notificationDetail.lower_border_active &&
      notificationDetail.lower_border &&
      notificationDetail.lower_border >= apiData.pollution.aqi_value;

    const upperBorderExceeded =
      notificationDetail.upper_border_active &&
      notificationDetail.upper_border &&
      notificationDetail.upper_border <= apiData.pollution.aqi_value;

    if (lowerBorderExceeded || upperBorderExceeded) {
      if (notificationDetail.alert_in_progress) {
        return true;
      }

      const windSpeed = apiData.weather.wind_speed;
      const windDirection = apiData.weather.wind_direction;

      const speedDescription = retrieveDescription(
        WindSpeedDescriptions,
        windSpeed,
      );
      const directionDescription = retrieveDescription(
        WindDirectionDescriptions,
        windDirection,
      );

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Wind speed alert from Yenebezpeka!\n` +
          `Wind speed in ${apiData.city} is ${windSpeed} m/s\n` +
          (speedDescription ?? '') +
          (directionDescription
            ? `\nThe wind direction is ${directionDescription}`
            : ''),
      );

      return true;
    }

    return false;
  }

  public async notifyAboutWindSpeedByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);
    const windSpeed = data.weather.wind_speed;
    const windDirection = data.weather.wind_direction;

    const speedDescription = retrieveDescription(
      WindSpeedDescriptions,
      windSpeed,
    );
    const directionDescription = retrieveDescription(
      WindDirectionDescriptions,
      windDirection,
    );

    return await this.twilioService.notify(
      user.phone_number,
      `Wind speed in ${data.city} is ${windSpeed} m/s\n` +
        (speedDescription ?? '') +
        (directionDescription
          ? `\nThe wind direction is ${directionDescription}`
          : ''),
    );
  }

  public async alertAboutHumidity(
    notificationDetail: NotificationDetailsRecord,
    apiData: IqAirDto,
    phoneNumber: string,
  ): Promise<boolean> {
    const lowerBorderExceeded =
      notificationDetail.lower_border_active &&
      notificationDetail.lower_border &&
      notificationDetail.lower_border >= apiData.weather.humidity;

    const upperBorderExceeded =
      notificationDetail.upper_border_active &&
      notificationDetail.upper_border &&
      notificationDetail.upper_border <= apiData.weather.humidity;

    if (lowerBorderExceeded || upperBorderExceeded) {
      if (notificationDetail.alert_in_progress) {
        return true;
      }

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Humidity alert from Yenebezpeka!\n` +
          `Humidity in ${apiData.city} is ${apiData.weather.humidity}%`,
      );

      return true;
    }

    return false;
  }

  public async notifyAboutHumidityByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Humidity in ${data.city} is ${data.weather.humidity}%`,
    );
  }

  public async alertAboutAtmosphericPressure(
    notificationDetail: NotificationDetailsRecord,
    apiData: IqAirDto,
    phoneNumber: string,
  ): Promise<boolean> {
    const lowerBorderExceeded =
      notificationDetail.lower_border_active &&
      notificationDetail.lower_border &&
      notificationDetail.lower_border >= apiData.pollution.aqi_value;

    const upperBorderExceeded =
      notificationDetail.upper_border_active &&
      notificationDetail.upper_border &&
      notificationDetail.upper_border <= apiData.pollution.aqi_value;

    if (lowerBorderExceeded || upperBorderExceeded) {
      if (notificationDetail.alert_in_progress) {
        return true;
      }

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Atmospheric pressure alert from Yenebezpeka!\n` +
          `Atmospheric Pressure in ${apiData.city} is ${apiData.weather.atmospheric_pressure} hPa`,
      );

      return true;
    }

    return false;
  }

  public async notifyAboutAtmosphericPressureByUser(
    user: UserRecord,
  ): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Atmospheric pressure in ${data.city} is ${data.weather.atmospheric_pressure} hPa`,
    );
  }

  public async alertAboutAirTemperature(
    notificationDetail: NotificationDetailsRecord,
    apiData: IqAirDto,
    phoneNumber: string,
  ): Promise<boolean> {
    const lowerBorderExceeded =
      notificationDetail.lower_border_active &&
      notificationDetail.lower_border &&
      notificationDetail.lower_border >= apiData.weather.temperature;

    const upperBorderExceeded =
      notificationDetail.upper_border_active &&
      notificationDetail.upper_border &&
      notificationDetail.upper_border <= apiData.weather.temperature;

    if (lowerBorderExceeded || upperBorderExceeded) {
      if (notificationDetail.alert_in_progress) {
        return true;
      }

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Air temperature alert from Yenebezpeka!\n` +
          `Air temperature in ${apiData.city} is ${apiData.weather.temperature} degree Celsius`,
      );

      return true;
    }

    return false;
  }

  public async notifyAboutAirTemperatureByUser(
    user: UserRecord,
  ): Promise<void> {
    const data = await this.retrieveForUser(user);

    return await this.twilioService.notify(
      user.phone_number,
      `Air temperature in ${data.city} is ${data.weather.temperature} degree Celsius`,
    );
  }

  public async alertAboutAirQuality(
    notificationDetail: NotificationDetailsRecord,
    apiData: IqAirDto,
    phoneNumber: string,
  ): Promise<boolean> {
    const lowerBorderExceeded =
      notificationDetail.lower_border_active &&
      notificationDetail.lower_border &&
      notificationDetail.lower_border >= apiData.pollution.aqi_value;

    const upperBorderExceeded =
      notificationDetail.upper_border_active &&
      notificationDetail.upper_border &&
      notificationDetail.upper_border <= apiData.pollution.aqi_value;

    if (lowerBorderExceeded || upperBorderExceeded) {
      if (notificationDetail.alert_in_progress) {
        return true;
      }
      const airQuality = apiData.pollution.aqi_value;
      const description = retrieveDescription(
        AirQualityDescriptions,
        airQuality,
      );

      await this.twilioService.notify(
        phoneNumber,
        `Attention! Air quality alert from Yenebezpeka!\n` +
          `Air quality in ${apiData.city} is ${airQuality}\n` +
          (description ?? '') +
          `\nThe main pollutant is ${
            MainPollutants[apiData.pollution.main_pollutant]
          }`,
      );

      return true;
    }

    return false;
  }

  public async notifyAboutAirQualityByUser(user: UserRecord): Promise<void> {
    const data = await this.retrieveForUser(user);
    const airQuality = data.pollution.aqi_value;

    const description = retrieveDescription(AirQualityDescriptions, airQuality);

    return await this.twilioService.notify(
      user.phone_number,
      `Air quality in ${data.city} is ${airQuality}\n` +
        (description ?? '') +
        `\nThe main pollutant is ${
          MainPollutants[data.pollution.main_pollutant]
        }`,
    );
  }

  public async retrieveForUser(user: UserRecord): Promise<IqAirDto> {
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
