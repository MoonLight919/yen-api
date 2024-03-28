import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { RestMethod } from '@modules/core';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { UserRecord } from '@resources/user/interfaces';
import { TwilioService } from '../services';

@ApiTags('Twilio')
@Controller('twilio')
@AuthProtected()
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}
  @Post('test')
  @ApiOperation({ summary: 'Send test message to user' })
  @RestMethod({})
  public async testMessage(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<void> {
    await this.twilioService.testMessage(user);
  }
}
