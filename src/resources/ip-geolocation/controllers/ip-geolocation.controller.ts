import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { AuthProtected } from '@resources/auth/decorators';
import { RestMethod } from '@modules/core';
import { ref } from '@lib/schemas';
import { IpGeolocationService } from '../services';
import { type IpGeolocationDto, ipGeolocationDtoSchema } from '../contracts';

@ApiTags('IP-Geolocation')
@Controller('ip-geolocation')
@AuthProtected()
export class IpGeolocationController {
  constructor(private readonly ipGeolocationService: IpGeolocationService) {}
  @Get(':ip_address')
  @ApiOperation({ summary: 'Retrieve geolocation by IP address' })
  @RestMethod({
    responses: {
      200: {
        schema: ref(ipGeolocationDtoSchema),
      },
    },
  })
  public async retrieve(
    @Param('ip_address') ipAddress: string,
  ): Promise<IpGeolocationDto> {
    return this.ipGeolocationService.retrieve(ipAddress);
  }
}
