import { Controller, Get } from '@nestjs/common';
import { MapsService } from './maps.service.js';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('alumni-by-city')
  async getAlumniByCity() {
    return this.mapsService.getAlumniByCity();
  }

  @Get('alumni-by-kecamatan')
  async getAlumniByKecamatan() {
    return this.mapsService.getAlumniByKecamatan();
  }

  @Get('alumni-by-status')
  async getAlumniByStatus() {
    return this.mapsService.getAlumniByStatus();
  }
}
