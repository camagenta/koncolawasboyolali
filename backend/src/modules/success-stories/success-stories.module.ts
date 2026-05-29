import { Module } from '@nestjs/common';
import { SuccessStoriesController } from './success-stories.controller.js';
import { SuccessStoriesService } from './success-stories.service.js';

@Module({
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
  exports: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
