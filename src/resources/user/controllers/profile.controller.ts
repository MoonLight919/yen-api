import { Get, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RestMethod } from '@modules/core/decorators';
import { ResourceMissingHttpException } from '@lib/exceptions/api';
import { httpAssert } from '@utils';
import { ref } from '@lib/schemas';
import { Metadata, MetadataContainer } from '@modules/core';
import { AuthProtected } from '@resources/auth/decorators';
import { UserService } from '../services';
import {
  type RetrieveCurrentUserResponseDto,
  retrieveCurrentUserResponseDtoSchema,
} from '../schemas';

@ApiTags('Profile')
@Controller('profile')
@AuthProtected()
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a user' })
  @RestMethod({
    responses: {
      200: { schema: ref(retrieveCurrentUserResponseDtoSchema) },
    },
  })
  public async retrieve(
    @Metadata() metadata: MetadataContainer,
  ): Promise<RetrieveCurrentUserResponseDto> {
    const profile = await this.userService.retrieve(metadata.idUser);
    httpAssert(profile, new ResourceMissingHttpException());
    return {
      user: profile,
    };
  }
}
