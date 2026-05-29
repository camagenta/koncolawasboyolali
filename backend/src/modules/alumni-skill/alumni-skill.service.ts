import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto.js';

@Injectable()
export class AlumniSkillService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, kategori?: string, format?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (kategori) where.kategori = kategori;
    if (format) where.format = format;

    const [data, total] = await Promise.all([
      this.prisma.alumniSkill.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          alumniProfile: {
            include: { user: true },
          },
        },
      }),
      this.prisma.alumniSkill.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const skill = await this.prisma.alumniSkill.findUnique({
      where: { id },
      include: {
        alumniProfile: {
          include: { user: true },
        },
      },
    });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async findByUserId(userId: string) {
    return this.prisma.alumniSkill.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateSkillDto) {
    return this.prisma.alumniSkill.create({
      data: {
        ...dto,
        userId,
        level: dto.level ?? 'Pemula',
        ketersediaan: dto.ketersediaan ?? 'online',
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateSkillDto) {
    const skill = await this.findById(id);
    if (skill.userId !== userId) throw new ForbiddenException('Not your skill');
    return this.prisma.alumniSkill.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const skill = await this.findById(id);
    if (skill.userId !== userId) throw new ForbiddenException('Not your skill');
    return this.prisma.alumniSkill.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async requestSkill(requesterId: string, dto: CreateSkillRequestDto) {
    return this.prisma.skillRequest.create({
      data: {
        ...dto,
        requesterId,
      },
    });
  }

  async getRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.skillRequest.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          alumniProfile: {
            include: { user: true },
          },
        },
      }),
      this.prisma.skillRequest.count(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markFulfilled(requestId: string) {
    const request = await this.prisma.skillRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Skill request not found');
    return this.prisma.skillRequest.update({
      where: { id: requestId },
      data: { isFulfilled: true },
    });
  }
}
