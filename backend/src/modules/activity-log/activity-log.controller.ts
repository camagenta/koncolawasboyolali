import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityLogService } from './activity-log.service.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('admin/activity-logs')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.activityLogService.findAll({ userId, action, page, limit, startDate, endDate });
  }
}
