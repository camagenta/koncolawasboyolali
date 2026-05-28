import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { QueryJobDto } from './dto/query-job.dto.js';
import { RejectJobDto } from './dto/reject-job.dto.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() query: QueryJobDto, @Req() req) {
    return this.jobsService.findAll(query, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateJobDto, @Req() req) {
    return this.jobsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateJobDto, @Req() req) {
    return this.jobsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req) {
    return this.jobsService.remove(id, req.user.id);
  }

  @Post(':id/approve')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async approve(@Param('id') id: string, @Req() req) {
    return this.jobsService.approve(id, req.user.id);
  }

  @Post(':id/reject')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async reject(@Param('id') id: string, @Body() dto: RejectJobDto, @Req() req) {
    return this.jobsService.reject(id, dto, req.user.id);
  }
}
