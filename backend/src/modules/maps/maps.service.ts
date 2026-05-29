import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class MapsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAlumniByCity() {
    const result = await this.prisma.alumniProfile.groupBy({
      by: ['kotaDomisili'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    return result.map((r) => ({ kota: r.kotaDomisili, count: r._count.id }));
  }

  async getAlumniByKecamatan() {
    const result = await this.prisma.alumniProfile.groupBy({
      by: ['kecamatanAsalBoyolali'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    return result.map((r) => ({ kecamatan: r.kecamatanAsalBoyolali, count: r._count.id }));
  }

  async getAlumniByStatus() {
    const result = await this.prisma.alumniProfile.groupBy({
      by: ['statusUtama'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    return result.map((r) => ({ status: r.statusUtama, count: r._count.id }));
  }

  async getOverview() {
    const [total, byYear, byStatus, totalForumThreads, totalJobs] = await Promise.all([
      this.prisma.alumniProfile.count(),
      this.prisma.alumniProfile.groupBy({
        by: ['tahunLulus'],
        _count: { id: true },
        orderBy: { tahunLulus: 'asc' },
      }),
      this.prisma.alumniProfile.groupBy({
        by: ['statusUtama'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      this.prisma.forumThread.count(),
      this.prisma.jobPosting.count({ where: { status: 'approved' } }),
    ]);

    return {
      total,
      totalForumThreads,
      totalJobs,
      byTahunLulus: byYear.map((r) => ({ tahun: r.tahunLulus, count: r._count.id })),
      byStatusUtama: byStatus.map((r) => ({ status: r.statusUtama, count: r._count.id })),
    };
  }
}
