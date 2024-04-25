import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { alertsInUaConfig as aiac } from '@config/alerts-in-ua.config';
import { type UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '@resources/twilio/services';
import {
  AlertTypes,
  UkraineRegionNamesUId,
} from '@resources/alerts-in-ua/alerts-in-ua.constants';
import { type Alert, type AlertsInUaDto } from '../contracts';

@Injectable()
export class AlertsInUaService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(aiac.KEY)
    private readonly alertsInUaConfig: ConfigType<typeof aiac>,
    private readonly twilioService: TwilioService,
  ) {}

  public async notifyByUser(user: UserRecord): Promise<void> {
    const alerts = await this.retrieve();
    /*const region = user.default_location_for_alerts_in_ua_notifications
      ? user.default_region
      : user.current_region;*/
    const region = user.default_region;

    let messageBody: string;

    if (!region) {
      messageBody = await this.formMessage(alerts, true);
    } else {
      const convertedRegion = UkraineRegionNamesUId[region];
      const alertInRegion = alerts.filter(
        (alert) => alert.region === convertedRegion,
      );

      messageBody = await this.formMessage(alertInRegion);
    }

    return this.twilioService.notify(user.phone_number, messageBody);
  }

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
      region: alert.location_oblast,
      type: alert.alert_type,
      location: alert.location_title,
      area: alert?.location_raion ?? null,
    }));
  }

  private async formMessage(
    alerts: AlertsInUaDto[],
    generalInformation = false,
  ): Promise<string> {
    if (alerts.length === 0) {
      if (generalInformation) {
        return 'There are no alerts for the civilians in Ukraine';
      }
      return 'There are no alerts in your region';
    }

    const header = generalInformation
      ? 'Current alerts information:'
      : 'Attention!';

    const information = alerts.map((alert) => {
      const locationDetails: string[] = [];
      if (alert.location) {
        locationDetails.push(alert.location);
      }
      if (alert.area) {
        locationDetails.push(alert.area);
      }
      if (alert.region && alert.region !== alert.location) {
        locationDetails.push(alert.region);
      }
      return `${AlertTypes[alert.type]} alert in ${locationDetails.join(', ')}`;
    });

    return `${header}\n\n${information.join('\n')}`;
  }
}
