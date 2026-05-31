import { Controller, Get } from '@nestjs/common';
import { FacebookService } from './facebook.service.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Public()
  @Get('group-stats')
  async getGroupStats() {
    const stats = await this.facebookService.getGroupStats();
    if (!stats) {
      return { configured: false, memberCount: null, name: null };
    }
    return {
      configured: true,
      memberCount: stats.memberCount,
      name: stats.name,
    };
  }
}
