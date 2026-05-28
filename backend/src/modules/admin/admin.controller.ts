import {
  Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service.js';
import { AdminGuard } from './guards/admin.guard.js';
import { QueryUserDto } from './dto/query-user.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { CreateAdminUnitDto } from './dto/create-admin-unit.dto.js';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async findAllUsers(@Query() query: QueryUserDto) {
    return this.adminService.findAllUsers(query);
  }

  @Get('users/:id')
  async findUser(@Param('id') id: string) {
    return this.adminService.findUser(id);
  }

  @Put('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.adminService.updateRole(id, dto);
  }

  @Patch('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Patch('users/:id/activate')
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Post('admin-units')
  async createAdminUnit(@Body() dto: CreateAdminUnitDto) {
    return this.adminService.createAdminUnit(dto);
  }

  @Get('admin-units')
  async findAllAdminUnits() {
    return this.adminService.findAllAdminUnits();
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }
}
