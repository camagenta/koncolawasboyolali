import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuccessStoriesService } from './success-stories.service.js';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto.js';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('success-stories')
export class SuccessStoriesController {
  constructor(private readonly successStoriesService: SuccessStoriesService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.successStoriesService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Get('featured')
  async findFeatured() {
    return this.successStoriesService.findFeatured();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.successStoriesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async create(@Body() dto: CreateSuccessStoryDto) {
    return this.successStoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSuccessStoryDto) {
    return this.successStoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async remove(@Param('id') id: string) {
    return this.successStoriesService.remove(id);
  }
}
