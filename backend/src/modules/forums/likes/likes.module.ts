import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller.js';
import { LikesService } from './likes.service.js';
import { NotificationsModule } from '../../notifications/notifications.module.js';

@Module({
  imports: [NotificationsModule],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
