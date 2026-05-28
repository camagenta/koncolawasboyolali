import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { ExportService } from './export.service.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('export')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('alumni/csv')
  async exportAlumniCsv(
    @Query('tahunMasuk') tahunMasuk?: string,
    @Query('jurusan') jurusan?: string,
    @Query('statusUtama') statusUtama?: string,
    @Query('kotaDomisili') kotaDomisili?: string,
    @Res() res?: Response,
  ) {
    const filters: any = {};
    if (tahunMasuk) filters.tahunMasuk = parseInt(tahunMasuk, 10);
    if (jurusan) filters.jurusan = jurusan;
    if (statusUtama) filters.statusUtama = statusUtama;
    if (kotaDomisili) filters.kotaDomisili = kotaDomisili;
    await this.exportService.exportAlumniCsv(filters, res!);
  }

  @Get('alumni/excel')
  async exportAlumniExcel(
    @Query('tahunMasuk') tahunMasuk?: string,
    @Query('jurusan') jurusan?: string,
    @Query('statusUtama') statusUtama?: string,
    @Query('kotaDomisili') kotaDomisili?: string,
    @Res() res?: Response,
  ) {
    const filters: any = {};
    if (tahunMasuk) filters.tahunMasuk = parseInt(tahunMasuk, 10);
    if (jurusan) filters.jurusan = jurusan;
    if (statusUtama) filters.statusUtama = statusUtama;
    if (kotaDomisili) filters.kotaDomisili = kotaDomisili;
    await this.exportService.exportAlumniExcel(filters, res!);
  }

  @Get('stats')
  async exportStats(@Res() res?: Response) {
    await this.exportService.exportStats(res!);
  }
}
