import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module.js';
import { EducationModule } from './education/education.module.js';
import { CareerModule } from './career/career.module.js';

@Module({
  imports: [ProfilesModule, EducationModule, CareerModule],
  exports: [ProfilesModule, EducationModule, CareerModule],
})
export class AlumniModule {}
