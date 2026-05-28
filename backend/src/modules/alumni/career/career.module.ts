import { Module } from '@nestjs/common';
import { CareerController } from './career.controller.js';
import { CareerService } from './career.service.js';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
