import { Module } from '@nestjs/common';
import { MapsController } from './maps.controller.js';
import { StatsController } from './stats.controller.js';
import { MapsService } from './maps.service.js';

@Module({
  controllers: [MapsController, StatsController],
  providers: [MapsService],
  exports: [MapsService],
})
export class MapsModule {}
