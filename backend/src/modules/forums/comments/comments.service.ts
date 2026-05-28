import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { NotificationsService } from '../../notifications/notifications.service.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(threadId: string, dto: CreateCommentDto, userId: string) {
    const thread = await this.prisma.forumThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    if (dto.parentId) {
      const parent = await this.prisma.forumComment.findUnique({ where: { id: dto.parentId } });
      if (!parent || parent.threadId !== threadId) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = await this.prisma.forumComment.create({
      data: {
        threadId,
        content: dto.content,
        parentId: dto.parentId ?? null,
        createdBy: userId,
      },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    await this.prisma.forumThread.update({
      where: { id: threadId },
      data: {
        totalComments: { increment: 1 },
        lastActivityAt: new Date(),
      },
    });

    if (thread.createdBy !== userId) {
      await this.notificationsService.create({
        userId: thread.createdBy,
        type: 'forum_reply',
        title: 'Komentar Baru',
        body: `${comment.creator.name} memberikan komentar pada thread "${thread.title}"`,
        link: `/forum/thread/${threadId}`,
      });
    }

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto, userId: string, role: string) {
    const comment = await this.prisma.forumComment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.createdBy !== userId && role !== 'super_admin') {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.forumComment.update({
      where: { id },
      data: { content: dto.content },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const comment = await this.prisma.forumComment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.createdBy !== userId && role !== 'super_admin') {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.forumComment.delete({ where: { id } });

    await this.prisma.forumThread.update({
      where: { id: comment.threadId },
      data: { totalComments: { decrement: 1 } },
    });

    return { message: 'Comment deleted' };
  }
}
