import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateBusinessDto } from './dto/create-business.dto.js';
import { UpdateBusinessDto } from './dto/update-business.dto.js';
import { BusinessStatus } from '../../generated/prisma/index.js';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, kategori?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (kategori) where.kategori = kategori;
    if (status) {
      where.status = status;
    } else {
      where.status = BusinessStatus.active;
    }

    const [data, total] = await Promise.all([
      this.prisma.alumniBusiness.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          alumniProfile: {
            include: {
              user: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
        },
      }),
      this.prisma.alumniBusiness.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const business = await this.prisma.alumniBusiness.findUnique({
      where: { id },
      include: {
        alumniProfile: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async findByUserId(userId: string) {
    return this.prisma.alumniBusiness.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateBusinessDto) {
    return this.prisma.alumniBusiness.create({
      data: {
        userId,
        namaUsaha: dto.namaUsaha,
        deskripsi: dto.deskripsi,
        kategori: dto.kategori,
        noKontak: dto.noKontak,
        linkWebsite: dto.linkWebsite,
        linkInstagram: dto.linkInstagram,
        alamat: dto.alamat,
        cariMitra: dto.cariMitra ?? false,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateBusinessDto) {
    const business = await this.findById(id);
    if (business.userId !== userId) throw new ForbiddenException('Not your business listing');

    return this.prisma.alumniBusiness.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const business = await this.findById(id);
    if (business.userId !== userId) throw new ForbiddenException('Not your business listing');

    return this.prisma.alumniBusiness.delete({ where: { id } });
  }

  async approve(id: string, adminId: string) {
    const business = await this.findById(id);
    return this.prisma.alumniBusiness.update({
      where: { id },
      data: { status: BusinessStatus.active },
    });
  }

  async reject(id: string, reason: string) {
    const business = await this.findById(id);
    return this.prisma.alumniBusiness.update({
      where: { id },
      data: { status: BusinessStatus.rejected, rejectionReason: reason },
    });
  }

  async incrementViews(id: string) {
    return this.prisma.alumniBusiness.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });
  }
}
