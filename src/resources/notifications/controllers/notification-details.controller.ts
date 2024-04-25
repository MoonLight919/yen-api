import { Get, Controller, Patch, Body, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RestMethod } from '@modules/core/decorators';
import { ref } from '@lib/schemas';
import { ID, type List, listSchema } from '@lib/db';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { UserRecord } from '@resources/user/interfaces';
import { NotificationDetailsService } from '../services';
import {
  CreateNotificationDetailsRequestBodyDto,
  createNotificationDetailsRequestBodyDtoSchema,
  type NotificationDetailsDto,
  notificationDetailsDtoSchema,
  PatchNotificationDetailsRequestBodyDto,
  patchNotificationDetailsRequestBodyDtoSchema,
} from '../contracts';

@ApiTags('NotificationDetails')
@Controller('notification-details')
@AuthProtected()
export class NotificationDetailsController {
  constructor(
    private readonly notificationDetailsService: NotificationDetailsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification details instance' })
  @RestMethod({
    body: createNotificationDetailsRequestBodyDtoSchema,
  })
  public async create(
    @AuthenticatedUser() user: UserRecord,
    @Body()
    createNotificationDetailsRequestBodyDto: CreateNotificationDetailsRequestBodyDto,
  ): Promise<NotificationDetailsDto | null> {
    return this.notificationDetailsService.create({
      ...createNotificationDetailsRequestBodyDto,
      user: user.id,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification details instance' })
  @RestMethod({
    body: patchNotificationDetailsRequestBodyDtoSchema,
  })
  public async update(
    @Param('id') notificationDetailsId: ID,
    @Body()
    patchNotificationDetailsRequestBodyDto: PatchNotificationDetailsRequestBodyDto,
  ): Promise<NotificationDetailsDto | null> {
    return this.notificationDetailsService.update(
      notificationDetailsId,
      patchNotificationDetailsRequestBodyDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List notification details for user' })
  @RestMethod({
    responses: {
      200: { schema: listSchema(ref(notificationDetailsDtoSchema)) },
    },
  })
  public async retrieve(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<List<NotificationDetailsDto>> {
    return this.notificationDetailsService.list({
      user: user.id,
    });
  }
}
