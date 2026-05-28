import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { QueryUserDto } from './dto/query-user.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { CreateAdminUnitDto } from './dto/create-admin-unit.dto.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(query: QueryUserDto) {
    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: { select: { id: true, namaLengkap: true, nis: true, tahunMasuk: true, tahunLulus: true } },
          adminUnit: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            educations: true,
            careers: true,
          },
        },
        adminUnit: true,
        matchedInduk: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role as any },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  async deactivateUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  async activateUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  async createAdminUnit(dto: CreateAdminUnitDto) {
    return this.prisma.adminUnit.create({
      data: {
        userId: dto.userId,
        unitName: dto.unitName,
        tahunMasukTarget: dto.tahunMasukTarget,
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async findAllAdminUnits() {
    return this.prisma.adminUnit.findMany({
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async getStats() {
    const [totalUsers, totalAlumni, totalAdminUnits, totalJobs, totalBukuInduk, matchedBukuInduk] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'alumni' } }),
        this.prisma.adminUnit.count(),
        this.prisma.jobPosting.count(),
        this.prisma.bukuIndukRef.count(),
        this.prisma.bukuIndukRef.count({ where: { isMatched: true } }),
      ]);

    return {
      totalUsers,
      totalAlumni,
      totalAdminUnits,
      totalJobs,
      totalBukuInduk,
      matchedBukuInduk,
    };
  }
}
