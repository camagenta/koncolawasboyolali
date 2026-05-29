import { Injectable, ForbiddenException, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService implements OnApplicationBootstrap {
  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const count = await this.prisma.forumCategory.count();
    if (count === 0) {
      const firstUser = await this.prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
      if (!firstUser) {
        console.log('[Seed] No users found, skipping default forum category creation');
        return;
      }
      await this.prisma.forumCategory.create({
        data: {
          name: 'Umum',
          slug: 'umum',
          description: 'Diskusi umum untuk semua alumni',
          type: 'public',
          sortOrder: 0,
          createdBy: firstUser.id,
        },
      });
      console.log('[Seed] Created default forum category: Umum');
    }
  }

  async findAll() {
    return this.prisma.forumCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { creator: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async create(dto: CreateCategoryDto, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin_unit')) {
      throw new ForbiddenException('Only admins can create categories');
    }
    return this.prisma.forumCategory.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        type: dto.type ?? 'public',
        tahunMasukTarget: dto.tahunMasukTarget,
        sortOrder: dto.sortOrder ?? 0,
        createdBy: userId,
      },
    });
  }

  async update(id: string, dto: Partial<CreateCategoryDto>, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin_unit')) {
      throw new ForbiddenException('Only admins can update categories');
    }
    const existing = await this.prisma.forumCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    return this.prisma.forumCategory.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type && { type: dto.type }),
        ...(dto.tahunMasukTarget !== undefined && { tahunMasukTarget: dto.tahunMasukTarget }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'super_admin' && user.role !== 'admin_unit')) {
      throw new ForbiddenException('Only admins can delete categories');
    }
    const existing = await this.prisma.forumCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    return this.prisma.forumCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
