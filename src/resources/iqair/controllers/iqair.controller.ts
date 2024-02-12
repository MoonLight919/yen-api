import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { AuthProtected } from '@resources/auth/decorators';
import { RestMethod } from '@modules/core';
import { ref } from '@lib/schemas';
import { IqAirService } from '../services';
import { type IqAirDto, iqAirDtoSchema } from '../contracts';

@ApiTags('IQAir')
@Controller('iqair')
@AuthProtected()
export class IqAirController {
  constructor(private readonly iqAirService: IqAirService) {}
  @Get(':ip_address')
  @ApiOperation({ summary: 'Retrieve IQAir data by IP address' })
  @RestMethod({
    responses: {
      200: {
        schema: ref(iqAirDtoSchema),
      },
    },
  })
  public async retrieve(
    @Param('ip_address') ipAddress: string,
  ): Promise<IqAirDto> {
    return this.iqAirService.retrieveById(ipAddress);
  }
}
