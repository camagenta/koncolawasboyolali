import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateCareerDto } from './dto/create-career.dto.js';
import { UpdateCareerDto } from './dto/update-career.dto.js';

@Injectable()
export class CareerService {
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
    return this.prisma.careerHistory.findMany({
      where: { alumniProfileId },
      orderBy: { tahunMulai: 'desc' },
    });
  }

  async create(userId: string, dto: CreateCareerDto) {
    const alumniProfileId = await this.getProfileId(userId);
    return this.prisma.careerHistory.create({
      data: { alumniProfileId, ...dto },
    });
  }

  async update(userId: string, id: string, dto: UpdateCareerDto) {
    const alumniProfileId = await this.getProfileId(userId);
    const existing = await this.prisma.careerHistory.findFirst({
      where: { id, alumniProfileId },
    });
    if (!existing) throw new NotFoundException('Riwayat karir tidak ditemukan');

    return this.prisma.careerHistory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const alumniProfileId = await this.getProfileId(userId);
    const existing = await this.prisma.careerHistory.findFirst({
      where: { id, alumniProfileId },
    });
    if (!existing) throw new NotFoundException('Riwayat karir tidak ditemukan');

    return this.prisma.careerHistory.delete({ where: { id } });
  }
}
