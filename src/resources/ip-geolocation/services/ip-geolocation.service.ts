import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { ipGeolocationConfig as igc } from '@config/ip-geolocation.config';
import { type IpGeolocationDto } from '../contracts';

@Injectable()
export class IpGeolocationService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(igc.KEY)
    private readonly ipGeolocationConfig: ConfigType<typeof igc>,
  ) {}

  public async retrieve(ipAddress: string): Promise<IpGeolocationDto> {
    const response = await this.httpService
      .get(this.ipGeolocationConfig.baseUrl as string, {
        params: {
          api_key: this.ipGeolocationConfig.apiKey,
          ip_address: ipAddress,
        },
      })
      .toPromise();
    if (!response) {
      throw new Error(
        `Post request to ${this.ipGeolocationConfig.baseUrl} failed`,
      );
    }
    const { data: responseData } = response;

    return {
      ip_address: responseData.ip_address,
      city: responseData.city,
      region: responseData.region,
      postal_code: responseData.postal_code,
      country: responseData.country,
      continent: responseData.continent,
      longitude: responseData.longitude,
      latitude: responseData.latitude,
      timezone: responseData.timezone.abbreviation,
      flag_url: responseData.flag.svg,
    };
  }
}
