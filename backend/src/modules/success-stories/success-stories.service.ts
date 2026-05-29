import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto.js';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto.js';

@Injectable()
export class SuccessStoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.successStory.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.successStory.count(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFeatured() {
    return this.prisma.successStory.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async findById(id: string) {
    const story = await this.prisma.successStory.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Success story not found');
    return story;
  }

  async create(dto: CreateSuccessStoryDto) {
    return this.prisma.successStory.create({ data: dto });
  }

  async update(id: string, dto: UpdateSuccessStoryDto) {
    await this.findById(id);
    return this.prisma.successStory.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.successStory.delete({ where: { id } });
  }
}
