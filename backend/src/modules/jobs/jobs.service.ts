import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { QueryJobDto } from './dto/query-job.dto.js';
import { RejectJobDto } from './dto/reject-job.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(query: QueryJobDto, user?: any) {
    const where: any = {};

    if (query.kategoriBidang) where.kategoriBidang = query.kategoriBidang;
    if (query.lokasi) where.lokasi = query.lokasi;
    if (query.tipe) where.tipe = query.tipe;

    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin_unit';
    if (isAdmin && query.status) {
      where.status = query.status;
    } else if (!isAdmin) {
      where.status = 'approved';
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          poster: { select: { id: true, name: true, email: true } },
          approver: { select: { id: true, name: true } },
        },
      }),
      this.prisma.jobPosting.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');

    await this.prisma.jobPosting.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    return this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        poster: { select: { id: true, name: true, email: true } },
        approver: { select: { id: true, name: true } },
      },
    });
  }

  async create(dto: CreateJobDto, userId: string) {
    return this.prisma.jobPosting.create({
      data: {
        title: dto.title,
        description: dto.description,
        kategoriBidang: dto.kategoriBidang,
        lokasi: dto.lokasi,
        tipe: dto.tipe as any,
        linkExternal: dto.linkExternal,
        kontak: dto.kontak,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        postedBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.postedBy !== userId) throw new ForbiddenException('Not your job posting');
    if (job.status !== 'pending') throw new BadRequestException('Can only edit pending jobs');

    const data: any = { ...dto };
    if (dto.deadline) data.deadline = new Date(dto.deadline);
    if (dto.tipe) data.tipe = dto.tipe as any;

    return this.prisma.jobPosting.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.postedBy !== userId) throw new ForbiddenException('Not your job posting');

    return this.prisma.jobPosting.delete({ where: { id } });
  }

  async approve(id: string, userId: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');

    const updated = await this.prisma.jobPosting.update({
      where: { id },
      data: { status: 'approved', approvedBy: userId },
    });

    await this.notificationsService.create({
      userId: job.postedBy,
      type: 'job_approved',
      title: 'Lowongan Disetujui',
      body: `Lowongan "${job.title}" telah disetujui dan sekarang aktif.`,
      link: `/jobs/${id}`,
    });

    return updated;
  }

  async reject(id: string, dto: RejectJobDto, userId: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');

    const updated = await this.prisma.jobPosting.update({
      where: { id },
      data: { status: 'rejected', rejectionReason: dto.rejectionReason, approvedBy: userId },
    });

    await this.notificationsService.create({
      userId: job.postedBy,
      type: 'job_rejected',
      title: 'Lowongan Ditolak',
      body: `Lowongan "${job.title}" ditolak. Alasan: ${dto.rejectionReason || 'Tidak ada alasan'}`,
      link: `/jobs/${id}`,
    });

    return updated;
  }
}
