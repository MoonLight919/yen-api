import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { alertsInUaConfig as aiac } from '@config/alerts-in-ua.config';
import { type Alert, type AlertsInUaDto } from '../contracts';

@Injectable()
export class AlertsInUaService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(aiac.KEY)
    private readonly alertsInUaConfig: ConfigType<typeof aiac>,
  ) {}

  public async retrieve(): Promise<AlertsInUaDto[]> {
    const response = await this.httpService
      .get(`${this.alertsInUaConfig.baseUrl as string}/alerts/active.json`, {
        headers: {
          authorization: `Bearer ${this.alertsInUaConfig.apiKey}`,
        },
      })
      .toPromise();
    if (!response) {
      throw new Error(
        `Post request to ${this.alertsInUaConfig.baseUrl} failed`,
      );
    }

    return response.data.alerts.map((alert: Alert) => ({
      location: alert.location_oblast as string,
      started_at: alert.started_at as string,
    }));
  }
}
