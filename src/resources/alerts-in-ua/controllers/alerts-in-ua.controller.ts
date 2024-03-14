import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AuthProtected } from '@resources/auth/decorators';
import { RestMethod } from '@modules/core';
import { ref } from '@lib/schemas';
import { AlertsInUaService } from '../services';
import { type AlertsInUaDto, alertsInUaDtoSchema } from '../contracts';

@ApiTags('Alerts-in-UA')
@Controller('alerts-in-ua')
@AuthProtected()
export class AlertsInUaController {
  constructor(private readonly alertsInUaService: AlertsInUaService) {}
  @Get()
  @ApiOperation({ summary: 'Retrieve alerts in Ukraine' })
  @RestMethod({
    responses: {
      200: {
        schema: ref(alertsInUaDtoSchema),
      },
    },
  })
  public async retrieve(): Promise<AlertsInUaDto[]> {
    return this.alertsInUaService.retrieve();
  }
}
