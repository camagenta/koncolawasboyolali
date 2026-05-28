import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filters?: {
    tahunMasuk?: number;
    jurusan?: string;
    statusUtama?: string;
    kotaDomisili?: string;
  }) {
    const where: Record<string, any> = {};
    if (filters?.tahunMasuk) where.tahunMasuk = filters.tahunMasuk;
    if (filters?.jurusan) where.jurusan = filters.jurusan;
    if (filters?.statusUtama) where.statusUtama = filters.statusUtama;
    if (filters?.kotaDomisili) where.kotaDomisili = { contains: filters.kotaDomisili };
    return where;
  }

  async exportAlumniCsv(
    filters: {
      tahunMasuk?: number;
      jurusan?: string;
      statusUtama?: string;
      kotaDomisili?: string;
    },
    res: Response,
  ) {
    const profiles = await this.prisma.alumniProfile.findMany({
      where: this.buildWhere(filters),
      include: { user: { select: { email: true } } },
      orderBy: { namaLengkap: 'asc' },
    });

    const headers = [
      'Nama Lengkap',
      'NIS',
      'Email',
      'No HP',
      'Tahun Masuk',
      'Tahun Lulus',
      'Jurusan',
      'Kelas 3',
      'Kota Domisili',
      'Kecamatan Asal',
      'Status Utama',
      'LinkedIn',
      'Instagram',
    ];

    const rows = profiles.map((p) => [
      this.escapeCsv(p.namaLengkap),
      this.escapeCsv(p.nis || ''),
      this.escapeCsv(p.user.email),
      this.escapeCsv(p.noHp || ''),
      String(p.tahunMasuk),
      String(p.tahunLulus),
      this.escapeCsv(p.jurusan || ''),
      this.escapeCsv(p.kelas3 || ''),
      this.escapeCsv(p.kotaDomisili),
      this.escapeCsv(p.kecamatanAsalBoyolali || ''),
      p.statusUtama,
      this.escapeCsv(p.linkLinkedin || ''),
      this.escapeCsv(p.linkInstagram || ''),
    ]);

    const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="alumni.csv"');
    res.send(csv);
  }

  async exportAlumniExcel(
    filters: {
      tahunMasuk?: number;
      jurusan?: string;
      statusUtama?: string;
      kotaDomisili?: string;
    },
    res: Response,
  ) {
    const profiles = await this.prisma.alumniProfile.findMany({
      where: this.buildWhere(filters),
      include: { user: { select: { email: true } } },
      orderBy: { namaLengkap: 'asc' },
    });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Alumni');

    ws.columns = [
      { header: 'Nama Lengkap', key: 'namaLengkap', width: 30 },
      { header: 'NIS', key: 'nis', width: 15 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'No HP', key: 'noHp', width: 20 },
      { header: 'Tahun Masuk', key: 'tahunMasuk', width: 14 },
      { header: 'Tahun Lulus', key: 'tahunLulus', width: 14 },
      { header: 'Jurusan', key: 'jurusan', width: 20 },
      { header: 'Kelas 3', key: 'kelas3', width: 14 },
      { header: 'Kota Domisili', key: 'kotaDomisili', width: 20 },
      { header: 'Kecamatan Asal', key: 'kecamatanAsal', width: 22 },
      { header: 'Status Utama', key: 'statusUtama', width: 16 },
      { header: 'LinkedIn', key: 'linkedin', width: 30 },
      { header: 'Instagram', key: 'instagram', width: 30 },
    ];

    for (const p of profiles) {
      ws.addRow({
        namaLengkap: p.namaLengkap,
        nis: p.nis || '',
        email: p.user.email,
        noHp: p.noHp || '',
        tahunMasuk: p.tahunMasuk,
        tahunLulus: p.tahunLulus,
        jurusan: p.jurusan || '',
        kelas3: p.kelas3 || '',
        kotaDomisili: p.kotaDomisili,
        kecamatanAsal: p.kecamatanAsalBoyolali || '',
        statusUtama: p.statusUtama,
        linkedin: p.linkLinkedin || '',
        instagram: p.linkInstagram || '',
      });
    }

    ws.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="alumni.xlsx"');
    await wb.xlsx.write(res);
    res.end();
  }

  async exportStats(res: Response) {
    const [totalAlumni, byStatus, byJurusan, byTahunMasuk] = await Promise.all([
      this.prisma.alumniProfile.count(),
      this.prisma.alumniProfile.groupBy({
        by: ['statusUtama'],
        _count: true,
      }),
      this.prisma.alumniProfile.groupBy({
        by: ['jurusan'],
        _count: true,
      }),
      this.prisma.alumniProfile.groupBy({
        by: ['tahunMasuk'],
        _count: true,
      }),
    ]);

    const lines: string[] = ['\uFEFFStatistik Alumni', `Total Alumni,${totalAlumni}`, '', 'Status Utama'];
    for (const s of byStatus) {
      lines.push(`${s.statusUtama},${s._count}`);
    }
    lines.push('', 'Jurusan');
    for (const j of byJurusan) {
      lines.push(`${this.escapeCsv(j.jurusan || 'N/A')},${j._count}`);
    }
    lines.push('', 'Tahun Masuk');
    for (const t of byTahunMasuk) {
      lines.push(`${t.tahunMasuk},${t._count}`);
    }

    const csv = lines.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="statistik.csv"');
    res.send(csv);
  }

  private escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
