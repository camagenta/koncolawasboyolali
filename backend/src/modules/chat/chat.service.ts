import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { QueryMessagesDto } from './dto/query-messages.dto.js';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserGroups(userId: string) {
    return this.prisma.discussionGroup.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { lastActivityAt: 'desc' },
    });
  }

  async createGroup(dto: CreateGroupDto, userId: string) {
    const group = await this.prisma.discussionGroup.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type ?? 'public',
        maxMembers: dto.maxMembers ?? 0,
        createdBy: userId,
        members: {
          create: { userId, role: 'admin' },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });
    return group;
  }

  async findGroup(id: string, userId: string) {
    const group = await this.prisma.discussionGroup.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        members: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });
    if (!group) throw new NotFoundException('Group not found');

    const isMember = group.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('You are not a member of this group');

    return group;
  }

  async addMember(groupId: string, targetUserId: string, userId: string) {
    const group = await this.prisma.discussionGroup.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
    if (!group) throw new NotFoundException('Group not found');

    const isAdmin = group.members.some((m) => m.userId === userId && m.role === 'admin');
    if (!isAdmin) throw new ForbiddenException('Only group admins can add members');

    const alreadyMember = group.members.some((m) => m.userId === targetUserId);
    if (alreadyMember) throw new ForbiddenException('User is already a member');

    if (group.maxMembers > 0 && group.members.length >= group.maxMembers) {
      throw new ForbiddenException('Group member limit reached');
    }

    return this.prisma.groupMember.create({
      data: { groupId, userId: targetUserId, role: 'member' },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async removeMember(groupId: string, targetUserId: string, userId: string) {
    const group = await this.prisma.discussionGroup.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
    if (!group) throw new NotFoundException('Group not found');

    const isAdmin = group.members.some((m) => m.userId === userId && m.role === 'admin');
    if (!isAdmin) throw new ForbiddenException('Only group admins can remove members');

    const member = group.members.find((m) => m.userId === targetUserId);
    if (!member) throw new NotFoundException('Member not found');

    await this.prisma.groupMember.delete({ where: { id: member.id } });
    return { message: 'Member removed' };
  }

  async findMessages(query: QueryMessagesDto, userId: string) {
    const { receiverId, groupId, page = 1, limit = 50 } = query;
    const where: any = {};

    if (receiverId) {
      where.OR = [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ];
    } else if (groupId) {
      where.groupId = groupId;
      const isMember = await this.prisma.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId } },
      });
      if (!isMember) throw new ForbiddenException('You are not a member of this group');
    } else {
      where.OR = [
        { senderId: userId },
        { receiverId: userId },
      ];
    }

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      this.prisma.chatMessage.count({ where }),
    ]);

    return { data: messages.reverse(), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async saveMessage(data: { senderId: string; receiverId?: string; groupId?: string; message: string; messageType?: string; fileUrl?: string }) {
    return this.prisma.chatMessage.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId ?? null,
        groupId: data.groupId ?? null,
        message: data.message,
        messageType: data.messageType ?? 'text',
        fileUrl: data.fileUrl ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }
}
