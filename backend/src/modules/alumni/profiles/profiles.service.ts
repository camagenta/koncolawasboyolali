import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

const VALID_STATUS_UTAMA = ['Bekerja', 'Kuliah', 'Wirausaha', 'Belum_Bekerja', 'Lainnya'];

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    q?: string;
    tahunMasuk?: string;
    jurusan?: string;
    statusUtama?: string;
    kotaDomisili?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const where: any = {};

    if (query.q) {
      where.OR = [
        { namaLengkap: { contains: query.q } },
        { nis: { contains: query.q } },
      ];
    }
    if (query.tahunMasuk) where.tahunMasuk = parseInt(query.tahunMasuk, 10);
    if (query.jurusan) where.jurusan = query.jurusan;
    if (query.statusUtama) {
      if (!VALID_STATUS_UTAMA.includes(query.statusUtama)) {
        throw new BadRequestException(
          `Invalid statusUtama: ${query.statusUtama}. Valid values: ${VALID_STATUS_UTAMA.join(', ')}`,
        );
      }
      where.statusUtama = query.statusUtama;
    }
    if (query.kotaDomisili) where.kotaDomisili = { contains: query.kotaDomisili };

    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '12', 10)));
    const skip = (page - 1) * limit;

    const fieldMap: Record<string, string> = {
      nama: 'namaLengkap',
      tahunMasuk: 'tahunMasuk',
      createdAt: 'createdAt',
    };
    const sortField = fieldMap[query.sortBy || ''] || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    const [data, total] = await Promise.all([
      this.prisma.alumniProfile.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.alumniProfile.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPublicProfile(id: string) {
    const profile = await this.prisma.alumniProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        educations: { orderBy: { tahunMasuk: 'desc' } },
        careers: { orderBy: { tahunMulai: 'desc' } },
      },
    });
    if (!profile) throw new NotFoundException('Profil alumni tidak ditemukan');
    const { noHp, alamatLengkap, linkLinkedin, linkInstagram, ...publicProfile } = profile;
    return publicProfile;
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.alumniProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        educations: true,
        careers: true,
      },
    });
    if (!profile) throw new NotFoundException('Profil alumni tidak ditemukan');
    return profile;
  }

  async findById(id: string) {
    const profile = await this.prisma.alumniProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        educations: true,
        careers: true,
      },
    });
    if (!profile) throw new NotFoundException('Profil alumni tidak ditemukan');
    return profile;
  }

  async create(userId: string, dto: CreateProfileDto) {
    const existing = await this.prisma.alumniProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Profil alumni sudah ada');

    return this.prisma.alumniProfile.create({
      data: { userId, ...dto },
    });
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.alumniProfile.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('Profil alumni tidak ditemukan');

    return this.prisma.alumniProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async updatePhoto(userId: string, photoUrl: string) {
    const existing = await this.prisma.alumniProfile.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('Profil alumni tidak ditemukan');

    return this.prisma.alumniProfile.update({
      where: { userId },
      data: { fotoProfil: photoUrl },
    });
  }
}
