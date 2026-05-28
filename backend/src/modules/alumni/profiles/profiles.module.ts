import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';

@Module({
  imports: [MulterModule.register({ dest: './uploads/profiles' })],
  controllers: [ProfilesController],
  providers: [ProfilesService, JwtAuthGuard],
  exports: [ProfilesService],
})
export class ProfilesModule {}
