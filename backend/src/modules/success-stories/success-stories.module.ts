import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SuccessStoriesController } from './success-stories.controller.js';
import { SuccessStoriesService } from './success-stories.service.js';

@Module({
  imports: [MulterModule.register({ dest: './uploads/success-stories' })],
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
  exports: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
