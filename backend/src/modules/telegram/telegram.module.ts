import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { TelegramController } from './telegram.controller.js';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
