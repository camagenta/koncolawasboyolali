import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EducationService } from './education.service.js';
import { CreateEducationDto } from './dto/create-education.dto.js';
import { UpdateEducationDto } from './dto/update-education.dto.js';

@Controller('alumni/educations')
@UseGuards(AuthGuard('jwt'))
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll(@Req() req) {
    return this.educationService.findAll(req.user.id);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateEducationDto) {
    return this.educationService.create(req.user.id, dto);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.educationService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.educationService.remove(req.user.id, id);
  }
}
