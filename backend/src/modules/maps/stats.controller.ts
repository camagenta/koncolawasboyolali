import { Controller, Get } from '@nestjs/common';
import { MapsService } from './maps.service.js';

@Controller('stats')
export class StatsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('overview')
  async getOverview() {
    return this.mapsService.getOverview();
  }
}
