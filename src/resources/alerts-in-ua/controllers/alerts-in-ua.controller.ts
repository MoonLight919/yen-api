import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { RestMethod } from '@modules/core';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { UserRecord } from '@resources/user/interfaces';
import { AlertsInUaService } from '../services';

@ApiTags('Alerts-in-UA')
@Controller('alerts-in-ua')
@AuthProtected()
export class AlertsInUaController {
  constructor(private readonly alertsInUaService: AlertsInUaService) {}
  @Post('/current-information')
  @ApiOperation({ summary: 'Send notification about current information' })
  @RestMethod({})
  public async notify(@AuthenticatedUser() user: UserRecord): Promise<void> {
    return this.alertsInUaService.notifyByUser(user);
  }
}
