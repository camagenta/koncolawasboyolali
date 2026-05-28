import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateThreadDto } from './dto/create-thread.dto.js';
import { UpdateThreadDto } from './dto/update-thread.dto.js';
import { QueryThreadsDto } from './dto/query-threads.dto.js';

@Injectable()
export class ThreadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryThreadsDto) {
    const { categoryId, page = 1, limit = 20 } = query;
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    const [threads, total] = await Promise.all([
      this.prisma.forumThread.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { lastActivityAt: 'desc' },
        include: {
          creator: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true, likes: true } },
        },
      }),
      this.prisma.forumThread.count({ where }),
    ]);

    return { data: threads, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const thread = await this.prisma.forumThread.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            creator: { select: { id: true, name: true, avatarUrl: true } },
            replies: {
              orderBy: { createdAt: 'asc' },
              include: {
                creator: { select: { id: true, name: true, avatarUrl: true } },
              },
            },
          },
        },
      },
    });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async create(dto: CreateThreadDto, userId: string) {
    const category = await this.prisma.forumCategory.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.forumThread.create({
      data: {
        categoryId: dto.categoryId,
        title: dto.title,
        content: dto.content,
        createdBy: userId,
      },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async update(id: string, dto: UpdateThreadDto, userId: string, role: string) {
    const thread = await this.prisma.forumThread.findUnique({ where: { id } });
    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.createdBy !== userId && role !== 'super_admin') {
      throw new ForbiddenException('You can only edit your own threads');
    }

    return this.prisma.forumThread.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, role: string) {
    const thread = await this.prisma.forumThread.findUnique({ where: { id } });
    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.createdBy !== userId && role !== 'super_admin') {
      throw new ForbiddenException('You can only delete your own threads');
    }

    await this.prisma.$transaction([
      this.prisma.forumLike.deleteMany({ where: { threadId: id } }),
      this.prisma.forumLike.deleteMany({ where: { comment: { threadId: id } } }),
      this.prisma.forumComment.deleteMany({ where: { threadId: id } }),
      this.prisma.forumThread.delete({ where: { id } }),
    ]);
    return { message: 'Thread deleted' };
  }
}
