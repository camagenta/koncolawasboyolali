import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service.js';
import { FacebookController } from './facebook.controller.js';

@Module({
  controllers: [FacebookController],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}
