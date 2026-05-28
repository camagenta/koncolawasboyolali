import {
  Controller, Get, Post, Body, Param, Query, Req, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service.js';
import { SearchBukuIndukDto } from './dto/search-buku-induk.dto.js';
import { MatchBukuIndukDto } from './dto/match-buku-induk.dto.js';
import { ImportSheetDto } from './dto/import-sheet.dto.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get('buku-induk/search')
  @UseGuards(AuthGuard('jwt'))
  async search(@Query() query: SearchBukuIndukDto) {
    return this.importService.search(query);
  }

  @Post('buku-induk/:id/match')
  @UseGuards(AuthGuard('jwt'))
  async match(@Param('id') id: string, @Body() dto: MatchBukuIndukDto, @Req() req) {
    return this.importService.match(id, dto, req.user.id);
  }

  @Post('buku-induk/upload')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    return this.importService.uploadCsv(file);
  }

  @Post('buku-induk/from-sheet')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async importFromSheet(@Body() dto: ImportSheetDto) {
    return this.importService.importFromSheet(dto);
  }

  @Get('buku-induk/status')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getStatus() {
    return this.importService.getStatus();
  }
}
