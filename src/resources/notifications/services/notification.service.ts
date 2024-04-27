import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigType } from '@nestjs/config';
import { UserService } from '@resources/user/services';
import { type UserRecord } from '@resources/user/interfaces';
import { AlertsInUaService } from '@resources/alerts-in-ua/services';
import { type NotificationDetailsRecord } from '@resources/notifications/contracts';
import { IqAirService } from '@resources/iqair/services';
import { type IqAirDto } from '@resources/iqair/contracts';
import { SaveEcoBotService } from '@resources/save-eco-bot/services';
import { type RadiationInformationDto } from '@resources/save-eco-bot/contracts';
import { featuresConfig as fc } from '@config/features.config';
import { NotificationTypes } from '../notifications.constants';
import { NotificationDetailsService } from './notification-details.service';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(fc.KEY)
    private readonly featuresConfig: ConfigType<typeof fc>,
    private readonly notificationDetailsService: NotificationDetailsService,
    private readonly userService: UserService,
    private readonly alertsInUaService: AlertsInUaService,
    private readonly iqAirService: IqAirService,
    private readonly saveEcoBotService: SaveEcoBotService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async notify(): Promise<void> {
    if (this.featuresConfig.notifications) {
      const users = (await this.userService.list()).data;
      const notificationDetails = (
        await this.notificationDetailsService.list({
          active: true,
        })
      ).data;

      await this.notifyAlertsInUA(users, notificationDetails);
      await this.notifyIQAir(users, notificationDetails);
      await this.notifySaveEcoBot(users, notificationDetails);
    }
  }

  public async notifySaveEcoBot(
    users: UserRecord[],
    notificationDetails: NotificationDetailsRecord[],
  ): Promise<void> {
    const saveEcoBotNotificationDetails = notificationDetails.filter(
      (notificationDetail) =>
        notificationDetail.type === NotificationTypes.RADIATION,
    );

    for (const user of users) {
      const userNotificationDetails = saveEcoBotNotificationDetails.filter(
        (iqAirNotificationDetail) => iqAirNotificationDetail.user === user.id,
      );

      if (userNotificationDetails.length === 0) {
        continue;
      }

      const data = await this.saveEcoBotService.retrieveForUser(user);
      await this.processRadiation(data, saveEcoBotNotificationDetails, user);
    }
  }

  public async notifyIQAir(
    users: UserRecord[],
    notificationDetails: NotificationDetailsRecord[],
  ): Promise<void> {
    const iqAirNotificationDetails = notificationDetails.filter(
      (notificationDetail) =>
        notificationDetail.type === NotificationTypes.AIR_QUALITY ||
        notificationDetail.type === NotificationTypes.AIR_TEMPERATURE ||
        notificationDetail.type === NotificationTypes.ATMOSPHERIC_PRESSURE ||
        notificationDetail.type === NotificationTypes.HUMIDITY ||
        notificationDetail.type === NotificationTypes.WEATHER ||
        notificationDetail.type === NotificationTypes.WIND_SPEED,
    );

    for (const user of users) {
      const userNotificationDetails = iqAirNotificationDetails.filter(
        (iqAirNotificationDetail) => iqAirNotificationDetail.user === user.id,
      );

      if (userNotificationDetails.length === 0) {
        continue;
      }

      const data = await this.iqAirService.retrieveForUser(user);
      await this.processAirQuality(data, iqAirNotificationDetails, user);
      await this.processAirTemperature(data, iqAirNotificationDetails, user);
      await this.processAtmosphericPressure(
        data,
        iqAirNotificationDetails,
        user,
      );
      await this.processHumidity(data, iqAirNotificationDetails, user);
      await this.processWindSpeed(data, iqAirNotificationDetails, user);
      await this.processWeather(data, iqAirNotificationDetails, user);
    }
  }

  public async notifyAlertsInUA(
    users: UserRecord[],
    notificationDetails: NotificationDetailsRecord[],
  ): Promise<void> {
    const alerts = await this.alertsInUaService.retrieve();
    const alertsInUaNotificationDetail = notificationDetails.filter(
      (notificationDetail) =>
        notificationDetail.type === NotificationTypes.ALERT_IN_UA,
    );

    for (const user of users) {
      const userNotificationDetail = alertsInUaNotificationDetail.find(
        (notificationDetail) => notificationDetail.user === user.id,
      );

      if (!userNotificationDetail) {
        continue;
      }
      const alertIssued = await this.alertsInUaService.alertByUser(
        alerts,
        userNotificationDetail.default_location
          ? user.default_region
          : user.current_region,
        user.phone_number,
        userNotificationDetail.alert_in_progress,
      );

      await this.updateNotificationDetailAlertState(
        userNotificationDetail,
        alertIssued,
      );
    }
  }

  private async processRadiation(
    apiData: RadiationInformationDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.RADIATION,
    );

    if (details) {
      const alertIssued = await this.saveEcoBotService.alertAboutRadiation(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async processWeather(
    apiData: IqAirDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.WEATHER,
    );

    if (details) {
      const alertIssued = await this.iqAirService.alertAboutWeather(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async processWindSpeed(
    apiData: IqAirDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.WIND_SPEED,
    );

    if (details) {
      const alertIssued = await this.iqAirService.alertAboutWindSpeed(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async processHumidity(
    apiData: IqAirDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.HUMIDITY,
    );

    if (details) {
      const alertIssued = await this.iqAirService.alertAboutHumidity(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async processAtmosphericPressure(
    apiData: IqAirDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.ATMOSPHERIC_PRESSURE,
    );

    if (details) {
      const alertIssued = await this.iqAirService.alertAboutAtmosphericPressure(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async processAirTemperature(
    apiData: IqAirDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.AIR_TEMPERATURE,
    );

    if (details) {
      const alertIssued = await this.iqAirService.alertAboutAirTemperature(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async processAirQuality(
    apiData: IqAirDto,
    notificationDetails: NotificationDetailsRecord[],
    user: UserRecord,
  ): Promise<void> {
    const details = notificationDetails.find(
      (details) => details.type === NotificationTypes.AIR_QUALITY,
    );

    if (details) {
      const alertIssued = await this.iqAirService.alertAboutAirQuality(
        details,
        apiData,
        user.phone_number,
      );

      await this.updateNotificationDetailAlertState(details, alertIssued);
    }
  }

  private async updateNotificationDetailAlertState(
    notificationDetail: NotificationDetailsRecord,
    alertWasIssued: boolean,
  ): Promise<void> {
    if (notificationDetail.alert_in_progress !== alertWasIssued) {
      await this.notificationDetailsService.update(notificationDetail.id, {
        alert_in_progress: alertWasIssued,
      });
    }
  }
}
