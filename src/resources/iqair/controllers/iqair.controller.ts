import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { RestMethod } from '@modules/core';
import { UserRecord } from '@resources/user/interfaces';
import { IqAirService } from '../services';

@ApiTags('IQAir')
@Controller('iqair')
@AuthProtected()
export class IqAirController {
  constructor(private readonly iqAirService: IqAirService) {}

  @Post('/current-information/weather')
  @ApiOperation({
    summary: 'Send notification about current information about weather',
  })
  @RestMethod({})
  public async notifyAboutWeatherByUser(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.iqAirService.notifyAboutWeatherByUser(user);
  }

  @Post('/current-information/wind-speed')
  @ApiOperation({
    summary: 'Send notification about current information about wind speed',
  })
  @RestMethod({})
  public async notifyAboutWindSpeedByUser(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.iqAirService.notifyAboutWindSpeedByUser(user);
  }

  @Post('/current-information/humidity')
  @ApiOperation({
    summary: 'Send notification about current information about humidity',
  })
  @RestMethod({})
  public async notifyAboutHumidityByUser(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.iqAirService.notifyAboutHumidityByUser(user);
  }

  @Post('/current-information/atmospheric-pressure')
  @ApiOperation({
    summary:
      'Send notification about current information about atmospheric pressure',
  })
  @RestMethod({})
  public async notifyAboutAtmosphericPressureByUser(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.iqAirService.notifyAboutAtmosphericPressureByUser(user);
  }

  @Post('/current-information/air-temperature')
  @ApiOperation({
    summary:
      'Send notification about current information about air temperature',
  })
  @RestMethod({})
  public async notifyAboutAirTemperatureByUser(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.iqAirService.notifyAboutAirTemperatureByUser(user);
  }

  @Post('/current-information/air-quality')
  @ApiOperation({
    summary: 'Send notification about current information about air quality',
  })
  @RestMethod({})
  public async notifyAboutAirQualityByUser(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.iqAirService.notifyAboutAirQualityByUser(user);
  }
}
