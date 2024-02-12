import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { iqAirConfig as iqac } from '@config/iqair.config';
import { IpGeolocationService } from '@resources/ip-geolocation/services';
import { type IqAirDto } from '../contracts';

@Injectable()
export class IqAirService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(iqac.KEY)
    private readonly iqAirConfig: ConfigType<typeof iqac>,
    private readonly ipGeolocationService: IpGeolocationService,
  ) {}

  public async retrieveById(ipAddress: string): Promise<IqAirDto> {
    const geolocation = await this.ipGeolocationService.retrieve(ipAddress);

    return this.retrieveByCoordinates(
      geolocation.latitude,
      geolocation.longitude,
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
