import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Public()
  @Post('webhook')
  async webhook(@Body() body: any) {
    await this.telegramService.handleWebhook(body);
    return { ok: true };
  }

  @Get('set-webhook')
  @UseGuards(AuthGuard('jwt'))
  async setWebhook(@Req() req) {
    if (req.user.role !== 'super_admin') {
      return { error: 'Forbidden' };
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return { error: 'TELEGRAM_BOT_TOKEN not set' };

    const webhookUrl = `${process.env.FRONTEND_URL || 'https://sma.kotakpasir.my.id'}/api/telegram/webhook`;
    const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`);
    const data = await res.json();
    return data;
  }
}
