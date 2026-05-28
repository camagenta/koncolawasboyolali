import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlumniModule } from './modules/alumni/alumni.module';
import { ForumsModule } from './modules/forums/forums.module';
import { ChatModule } from './modules/chat/chat.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AdminModule } from './modules/admin/admin.module';
import { MapsModule } from './modules/maps/maps.module';
import { ImportModule } from './modules/import/import.module';

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
