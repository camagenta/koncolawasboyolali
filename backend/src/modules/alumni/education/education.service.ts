import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateEducationDto } from './dto/create-education.dto.js';
import { UpdateEducationDto } from './dto/update-education.dto.js';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  private async getProfileId(userId: string) {
    const profile = await this.prisma.alumniProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) throw new NotFoundException('Profil alumni tidak ditemukan');
    return profile.id;
  }

  async findAll(userId: string) {
    const alumniProfileId = await this.getProfileId(userId);
    return this.prisma.educationHistory.findMany({
      where: { alumniProfileId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateEducationDto) {
    const alumniProfileId = await this.getProfileId(userId);
    return this.prisma.educationHistory.create({
      data: { alumniProfileId, ...dto },
    });
  }

  async update(userId: string, id: string, dto: UpdateEducationDto) {
    const alumniProfileId = await this.getProfileId(userId);
    const existing = await this.prisma.educationHistory.findFirst({
      where: { id, alumniProfileId },
    });
    if (!existing) throw new NotFoundException('Riwayat pendidikan tidak ditemukan');

    return this.prisma.educationHistory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const alumniProfileId = await this.getProfileId(userId);
    const existing = await this.prisma.educationHistory.findFirst({
      where: { id, alumniProfileId },
    });
    if (!existing) throw new NotFoundException('Riwayat pendidikan tidak ditemukan');

    return this.prisma.educationHistory.delete({ where: { id } });
  }
}
