import { Module } from '@nestjs/common';
import { AlumniSkillController } from './alumni-skill.controller.js';
import { AlumniSkillService } from './alumni-skill.service.js';

@Module({
  controllers: [AlumniSkillController],
  providers: [AlumniSkillService],
  exports: [AlumniSkillService],
})
export class AlumniSkillModule {}
