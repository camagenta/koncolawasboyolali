import { Controller, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Controller('forums')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('threads/:threadId/comments')
  @UseGuards(AuthGuard('jwt'))
  async create(@Param('threadId') threadId: string, @Body() dto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(threadId, dto, req.user.id);
  }

  @Put('comments/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Req() req) {
    return this.commentsService.update(id, dto, req.user.id, req.user.role);
  }

  @Delete('comments/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req) {
    return this.commentsService.remove(id, req.user.id, req.user.role);
  }
}
