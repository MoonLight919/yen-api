import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { RestMethod } from '@modules/core';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '../services';

@ApiTags('Twilio')
@Controller('twilio')
@AuthProtected()
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}
  @Get(':ip_address')
  @ApiOperation({ summary: 'Retrieve IQAir data by IP address' })
  @RestMethod({})
  public async testMessage(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    return this.twilioService.testMessage(user);
  }
}
