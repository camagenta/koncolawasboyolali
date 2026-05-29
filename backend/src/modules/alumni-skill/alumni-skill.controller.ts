import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlumniSkillService } from './alumni-skill.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('alumni-skill')
export class AlumniSkillController {
  constructor(private readonly alumniSkillService: AlumniSkillService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('kategori') kategori?: string,
    @Query('format') format?: string,
  ) {
    return this.alumniSkillService.findAll(Number(page) || 1, Number(limit) || 20, kategori, format);
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  async findMine(@Req() req) {
    return this.alumniSkillService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.alumniSkillService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Body() dto: CreateSkillDto) {
    return this.alumniSkillService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Req() req, @Body() dto: UpdateSkillDto) {
    return this.alumniSkillService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req) {
    return this.alumniSkillService.remove(id, req.user.id);
  }

  @Post('requests')
  @UseGuards(AuthGuard('jwt'))
  async requestSkill(@Req() req, @Body() dto: CreateSkillRequestDto) {
    return this.alumniSkillService.requestSkill(req.user.id, dto);
  }

  @Get('requests/admin')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getRequests(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.alumniSkillService.getRequests(Number(page) || 1, Number(limit) || 20);
  }

  @Patch('requests/:id/fulfill')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async markFulfilled(@Param('id') id: string) {
    return this.alumniSkillService.markFulfilled(id);
  }
}
