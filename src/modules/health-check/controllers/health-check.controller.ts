import { DatabaseHealthIndicator } from '@knexion/core';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  type HealthCheckResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { getBytesFromFriendly } from '@utils';

@ApiTags('Health indicator')
@Controller('health')
export class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly databaseHealthIndicator: DatabaseHealthIndicator,
  ) {}

  @Get('startup')
  @ApiOperation({
    summary: 'Returns the status of the application',
  })
  @ApiExcludeEndpoint(true)
  @HealthCheck()
  public async startup(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.databaseHealthIndicator.isHealthy(),
    ]);
  }

  @Get('readiness')
  @ApiOperation({
    summary: 'Returns the status of the application',
  })
  @ApiExcludeEndpoint(true)
  @HealthCheck()
  public async readiness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.memoryHealthIndicator.checkHeap(
          'memory_heap',
          getBytesFromFriendly(500, 'Mb'),
        ),
      () =>
        this.memoryHealthIndicator.checkRSS(
          'memory_rss',
          getBytesFromFriendly(1000, 'Mb'),
        ),
      () => this.databaseHealthIndicator.isHealthy(),
    ]);
  }

  @Get('liveness')
  @ApiOperation({
    summary: 'Returns the status of the application',
  })
  @ApiExcludeEndpoint(true)
  @HealthCheck()
  public async liveness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.databaseHealthIndicator.isHealthy(),
    ]);
  }
}
