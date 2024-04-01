import { Get, Controller, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RestMethod } from '@modules/core/decorators';
import { ResourceMissingHttpException } from '@lib/exceptions/api';
import { httpAssert } from '@utils';
import { ref } from '@lib/schemas';
import { AuthenticatedUser, AuthProtected } from '@resources/auth/decorators';
import { UserService } from '../services';
import {
  PatchUserRequestBodyDto,
  patchUserRequestBodyDtoSchema,
  userDtoSchema,
} from '../schemas';
import { UserRecord } from '../interfaces';

@ApiTags('Profile')
@Controller('profile')
@AuthProtected()
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @ApiOperation({ summary: 'Update a user profile' })
  @RestMethod({
    responses: {
      200: { schema: ref(patchUserRequestBodyDtoSchema) },
    },
  })
  public async update(
    @AuthenticatedUser() user: UserRecord,
    @Body() patchUserRequestBodyDto: PatchUserRequestBodyDto,
  ): Promise<UserRecord | null> {
    return this.userService.update(user.id, patchUserRequestBodyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a user' })
  @RestMethod({
    responses: {
      200: { schema: ref(userDtoSchema) },
    },
  })
  public async retrieve(
    @AuthenticatedUser() user: UserRecord,
  ): Promise<UserRecord> {
    const profile = await this.userService.retrieve(user.id);
    httpAssert(profile, new ResourceMissingHttpException());
    return profile;
  }
}
