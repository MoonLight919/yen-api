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
  @Post('/air-quality/current-information')
  @ApiOperation({
    summary: 'Send notification about current information of air quality',
  })
  @RestMethod({})
  public async notify(@AuthenticatedUser() user: UserRecord): Promise<void> {
    return this.iqAirService.notifyAboutAirQualityByUser(user);
  }
}
