import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

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
}
