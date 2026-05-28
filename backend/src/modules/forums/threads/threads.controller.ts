import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThreadsService } from './threads.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { QueryThreadsDto } from './dto/query-threads.dto.js';

@Controller('forums/threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  async findAll(@Query() query: QueryThreadsDto) {
    return this.threadsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.threadsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateThreadDto, @Req() req) {
    return this.threadsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateThreadDto, @Req() req) {
    return this.threadsService.update(id, dto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req) {
    return this.threadsService.remove(id, req.user.id, req.user.role);
  }
}
