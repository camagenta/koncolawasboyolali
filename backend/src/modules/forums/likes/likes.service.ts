import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async toggleThreadLike(threadId: string, userId: string) {
    const thread = await this.prisma.forumThread.findUnique({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    const existing = await this.prisma.forumLike.findUnique({
      where: { userId_threadId: { userId, threadId } },
    });

    if (existing) {
      await this.prisma.forumLike.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await this.prisma.forumLike.create({
      data: { userId, threadId },
    });

    if (thread.createdBy !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.notificationsService.create({
        userId: thread.createdBy,
        type: 'forum_like',
        title: 'Suka Thread',
        body: `${user?.name || 'Seseorang'} menyukai thread "${thread.title}"`,
        link: `/forum/thread/${threadId}`,
      });
    }

    return { liked: true };
  }

  async toggleCommentLike(commentId: string, userId: string) {
    const comment = await this.prisma.forumComment.findUnique({
      where: { id: commentId },
      include: { thread: { select: { title: true } } },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.prisma.forumLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (existing) {
      await this.prisma.forumLike.delete({ where: { id: existing.id } });
      await this.prisma.forumComment.update({
        where: { id: commentId },
        data: { totalLikes: { decrement: 1 } },
      });
      return { liked: false };
    }

    await this.prisma.forumLike.create({
      data: { userId, commentId },
    });
    await this.prisma.forumComment.update({
      where: { id: commentId },
      data: { totalLikes: { increment: 1 } },
    });

    if (comment.createdBy !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.notificationsService.create({
        userId: comment.createdBy,
        type: 'forum_like',
        title: 'Suka Komentar',
        body: `${user?.name || 'Seseorang'} menyukai komentar Anda di thread "${comment.thread.title}"`,
        link: `/forum/thread/${comment.threadId}`,
      });
    }

    return { liked: true };
  }

  async countThreadLikes(threadId: string) {
    const count = await this.prisma.forumLike.count({
      where: { threadId },
    });
    return { count };
  }
}
