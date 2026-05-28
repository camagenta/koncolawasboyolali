import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { EducationModule } from './education/education.module';
import { CareerModule } from './career/career.module';

@Module({
  imports: [ProfilesModule, EducationModule, CareerModule],
  exports: [ProfilesModule, EducationModule, CareerModule],
})
export class AlumniModule {}
