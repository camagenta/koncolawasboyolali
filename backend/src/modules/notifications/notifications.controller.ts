import { Controller, Get, Put, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.findAll(req.user.id, page, limit);
  }

  @Get('unread-count')
  @UseGuards(AuthGuard('jwt'))
  async getUnreadCount(@Req() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Put(':id/read')
  @UseGuards(AuthGuard('jwt'))
  async markRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markRead(id, req.user.id);
  }

  @Put('read-all')
  @UseGuards(AuthGuard('jwt'))
  async markAllRead(@Req() req) {
    return this.notificationsService.markAllRead(req.user.id);
  }
}
