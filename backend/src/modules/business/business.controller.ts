import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessService } from './business.service.js';
import { CreateBusinessDto } from './dto/create-business.dto.js';
import { UpdateBusinessDto } from './dto/update-business.dto.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('kategori') kategori?: string,
    @Query('status') status?: string,
  ) {
    return this.businessService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
      kategori,
      status,
    );
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  async findMine(@Req() req) {
    return this.businessService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.businessService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateBusinessDto, @Req() req) {
    return this.businessService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateBusinessDto, @Req() req) {
    return this.businessService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req) {
    return this.businessService.remove(id, req.user.id);
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async approve(@Param('id') id: string, @Req() req) {
    return this.businessService.approve(id, req.user.id);
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.businessService.reject(id, reason);
  }
}
