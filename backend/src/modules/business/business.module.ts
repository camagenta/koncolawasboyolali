import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller.js';
import { BusinessService } from './business.service.js';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
