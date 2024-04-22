import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { RestMethod } from '@modules/core';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { UserRecord } from '@resources/user/interfaces';
import { SaveEcoBotService } from '../services';

@ApiTags('Save-Eco-Bot')
@Controller('save-eco-bot')
@AuthProtected()
export class SaveEcoBotController {
  constructor(private readonly saveEcoBotService: SaveEcoBotService) {}
  @Post('/current-information')
  @ApiOperation({ summary: 'Send notification about current information' })
  @RestMethod({})
  public async notify(@AuthenticatedUser() user: UserRecord): Promise<void> {
    return this.saveEcoBotService.notifyByUser(user);
  }
}
