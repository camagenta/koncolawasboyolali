import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateBusinessDto } from './dto/create-business.dto.js';
import { UpdateBusinessDto } from './dto/update-business.dto.js';
import { BusinessStatus } from '../../generated/prisma/index.js';

function mapBusiness(b: any) {
  const { alumniProfile, cariMitra, noKontak, linkWebsite, linkInstagram, fotoUsaha1, fotoUsaha2, fotoUsaha3, ...rest } = b;
  return {
    ...rest,
    kontak: noKontak ?? undefined,
    website: linkWebsite ?? undefined,
    instagram: linkInstagram ?? undefined,
    fotoUsaha: fotoUsaha1 ?? fotoUsaha2 ?? fotoUsaha3 ?? undefined,
    isCariMitra: cariMitra,
    pemilik: alumniProfile?.user
      ? { id: alumniProfile.user.id, name: alumniProfile.user.name, avatarUrl: alumniProfile.user.avatarUrl }
      : null,
  };
}

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

    return { data: data.map(mapBusiness), total, page, limit, totalPages: Math.ceil(total / limit) };
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

    // Fetch other businesses by same user
    const otherBusinesses = await this.prisma.alumniBusiness.findMany({
      where: { userId: business.userId, id: { not: id }, status: BusinessStatus.active },
      select: { id: true, namaUsaha: true, kategori: true, fotoUsaha1: true },
      take: 5,
    });

    return {
      ...mapBusiness(business),
      otherBusinesses: otherBusinesses.map((ob) => ({
        id: ob.id,
        namaUsaha: ob.namaUsaha,
        kategori: ob.kategori,
        fotoUsaha: ob.fotoUsaha1 ?? undefined,
      })),
    };
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
        noKontak: dto.kontak,
        linkWebsite: dto.website,
        linkInstagram: dto.instagram,
        alamat: dto.alamat,
        cariMitra: dto.cariMitra ?? false,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateBusinessDto) {
    const business = await this.prisma.alumniBusiness.findUnique({ where: { id } });
    if (!business) throw new NotFoundException('Business not found');
    if (business.userId !== userId) throw new ForbiddenException('Not your business listing');

    const data: any = {};
    if (dto.namaUsaha !== undefined) data.namaUsaha = dto.namaUsaha;
    if (dto.deskripsi !== undefined) data.deskripsi = dto.deskripsi;
    if (dto.kategori !== undefined) data.kategori = dto.kategori;
    if (dto.kontak !== undefined) data.noKontak = dto.kontak;
    if (dto.website !== undefined) data.linkWebsite = dto.website;
    if (dto.instagram !== undefined) data.linkInstagram = dto.instagram;
    if (dto.alamat !== undefined) data.alamat = dto.alamat;
    if (dto.cariMitra !== undefined) data.cariMitra = dto.cariMitra;

    return this.prisma.alumniBusiness.update({
      where: { id },
      data,
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
