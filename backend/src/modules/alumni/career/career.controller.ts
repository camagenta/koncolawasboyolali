import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CareerService } from './career.service.js';
import { CreateCareerDto } from './dto/create-career.dto.js';
import { UpdateCareerDto } from './dto/update-career.dto.js';

@Controller('alumni/careers')
@UseGuards(AuthGuard('jwt'))
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get()
  async findAll(@Req() req) {
    return this.careerService.findAll(req.user.id);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateCareerDto) {
    return this.careerService.create(req.user.id, dto);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCareerDto) {
    return this.careerService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.careerService.remove(req.user.id, id);
  }
}
