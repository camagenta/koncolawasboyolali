import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  googleAuth(@Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback';
    const url =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent('email profile')}` +
      `&access_type=offline` +
      `&prompt=consent`;
    return res.redirect(url);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    const userEncoded = Buffer.from(JSON.stringify(result.user)).toString('base64');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${result.access_token}&user=${userEncoded}`,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Req() req) {
    return req.user;
  }
}
