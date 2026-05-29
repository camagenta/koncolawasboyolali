import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { ActivityLogService } from '../../activity-log/activity-log.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      scope: ['email', 'profile'],
      state: false,
      passReqToCallback: false,
    } as any);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;
    let user = await this.prisma.user.findUnique({ where: { googleId: id } });
    let isNew = false;
    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: id, lastLoginAt: new Date() },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            googleId: id,
            email,
            name: displayName,
            avatarUrl: photos?.[0]?.value,
          },
        });
        isNew = true;
      }
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }
    this.activityLogService.log(user.id, 'login', isNew ? 'user' : undefined, isNew ? user.id : undefined).catch(() => {});
    done(null, user);
  }
}
