import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service.js';

@Controller('forums')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('threads/:threadId/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleThreadLike(@Param('threadId') threadId: string, @Req() req) {
    return this.likesService.toggleThreadLike(threadId, req.user.id);
  }

  @Post('comments/:commentId/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleCommentLike(@Param('commentId') commentId: string, @Req() req) {
    return this.likesService.toggleCommentLike(commentId, req.user.id);
  }

  @Get('threads/:threadId/likes')
  async countThreadLikes(@Param('threadId') threadId: string) {
    return this.likesService.countThreadLikes(threadId);
  }
}
