import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AlumniModule } from './modules/alumni/alumni.module.js';
import { ForumsModule } from './modules/forums/forums.module.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { JobsModule } from './modules/jobs/jobs.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { MapsModule } from './modules/maps/maps.module.js';
import { ImportModule } from './modules/import/import.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AlumniModule,
    ForumsModule,
    ChatModule,
    JobsModule,
    AdminModule,
    MapsModule,
    ImportModule,
  ],
})
export class AppModule {}
