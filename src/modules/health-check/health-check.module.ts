import { DatabaseHealthIndicator } from '@knexion/core';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './controllers';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
  providers: [DatabaseHealthIndicator],
})
export class HealthCheckModule {}
