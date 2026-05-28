import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { SearchBukuIndukDto } from './dto/search-buku-induk.dto.js';
import { MatchBukuIndukDto } from './dto/match-buku-induk.dto.js';
import { ImportSheetDto } from './dto/import-sheet.dto.js';
import { parse } from 'csv-parse/sync';

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchBukuIndukDto) {
    const { q, limit = 10 } = dto;
    const records = await this.prisma.bukuIndukRef.findMany({
      where: { nama: { contains: q } },
      take: limit,
      orderBy: { nama: 'asc' },
      select: { id: true, nis: true, nama: true, tahunMasuk: true, jurusan: true, kelas3: true, noHp: true, alamat: true },
    });
    return records;
  }

  async match(id: string, dto: MatchBukuIndukDto, userId: string) {
    const ref = await this.prisma.bukuIndukRef.findUnique({ where: { id } });
    if (!ref) throw new NotFoundException('Buku induk reference not found');
    if (ref.isMatched) throw new BadRequestException('Already matched');

    const profile = await this.prisma.alumniProfile.findUnique({
      where: { id: dto.alumniProfileId },
    });
    if (!profile) throw new NotFoundException('Alumni profile not found');

    await this.prisma.$transaction([
      this.prisma.bukuIndukRef.update({
        where: { id },
        data: { isMatched: true, matchedBy: userId },
      }),
      this.prisma.alumniProfile.update({
        where: { id: dto.alumniProfileId },
        data: { bukuIndukId: id },
      }),
    ]);

    return { matched: true };
  }

  async uploadCsv(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('CSV file required');

    const csvString = file.buffer.toString('utf-8');
    let records: any[];
    try {
      records = parse(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
    } catch {
      throw new BadRequestException('Invalid CSV format');
    }

    const inserted: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const nis = row.nis || row.NIS || row['NO. INDUK'] || row['No. Induk'] || '';
      const nama = row.nama || row.Nama || row.NAMA || '';
      const tahunMasuk = parseInt(
        row.tahun_masuk || row.tahunMasuk || row.TahunMasuk || row['TAHUN MASUK'] || '0', 10
      );
      const jurusan = row.jurusan || row.Jurusan || row['KETERANGAN'] || row.Keterangan || null;
      const kelas3 = row.kelas_3 || row.kelas3 || row.Kelas3 || row['KELAS TERAKHIR'] || row['Kelas Terakhir'] || null;
      const noHp = row.no_hp || row.noHp || row['NO HP'] || row['No HP'] || row['No. HP'] || null;
      const alamat = row.alamat || row.Alamat || row.ALAMAT || null;

      if (!nis || !nama || isNaN(tahunMasuk)) {
        errors.push({ row: i + 2, message: 'Missing required fields (nis, nama, tahun_masuk)' });
        continue;
      }

      try {
        await this.prisma.bukuIndukRef.create({
          data: {
            nis: String(nis).trim(),
            nama: String(nama).trim(),
            tahunMasuk,
            jurusan: jurusan ? String(jurusan).trim() : null,
            kelas3: kelas3 ? String(kelas3).trim() : null,
            noHp: noHp ? String(noHp).trim() : null,
            alamat: alamat ? String(alamat).trim() : null,
          },
        });
        inserted.push({ nis, nama });
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ row: i + 2, message: `Duplicate NIS: ${nis}` });
        } else {
          errors.push({ row: i + 2, message: err.message });
        }
      }
    }

    return { inserted: inserted.length, errors };
  }

  async importFromSheet(dto: ImportSheetDto) {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKey) throw new BadRequestException('Google Sheets API key not configured in .env');

    const match = dto.sheetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) throw new BadRequestException('Invalid Google Sheets URL — could not extract spreadsheet ID');
    const sheetId = match[1];
    const range = encodeURIComponent(dto.sheetRange || 'A:Z');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const err = await response.text();
      throw new BadRequestException(`Google Sheets API error: ${err}`);
    }

    const data: any = await response.json();
    const rows: string[][] = data.values;
    if (!rows || rows.length < 2) {
      throw new BadRequestException('Sheet is empty or has fewer than 2 rows (header + 1 data row)');
    }

    const headers = rows[0].map(h => (h || '').trim().toLowerCase().replace(/[\s.\-]+/g, '_'));
    const idx = (name: string) => headers.indexOf(name.toLowerCase().replace(/[\s.\-]+/g, '_'));

    const inserted: any[] = [];
    const errors: any[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const getVal = (names: string[]) => {
        for (const name of names) {
          const col = idx(name);
          if (col !== -1 && row[col] && row[col].toString().trim()) {
            return row[col].toString().trim();
          }
        }
        return '';
      };

      const nis = getVal(['no_induk', 'no._induk', 'nis', 'no_indu']);
      const nama = getVal(['nama', 'nama_lengkap', 'nama_lkp', 'name']);
      const tahunMasukStr = getVal(['tahun_masuk', 'tahunmasuk', 'thn_masuk']);
      const tahunMasuk = parseInt(tahunMasukStr, 10);
      const jurusan = getVal(['keterangan', 'jurusan', 'prog_keahlian', 'program_keahlian']) || null;
      const kelas3 = getVal(['kelas_terakhir', 'kelas_akhir', 'kelas3', 'kelas_3']) || null;
      const noHp = getVal(['no_hp', 'no._hp', 'no_hp_ortu', 'hp', 'telp']) || null;
      const alamat = getVal(['alamat', 'alamat_lengkap', 'address', 'alamat_rumah']) || null;

      if (!nis || !nama || isNaN(tahunMasuk)) {
        errors.push({ row: i + 2, message: `Row ${i + 1}: missing required fields (nis, nama, tahun_masuk)` });
        continue;
      }

      try {
        await this.prisma.bukuIndukRef.create({
          data: {
            nis: String(nis).trim(),
            nama: String(nama).trim(),
            tahunMasuk,
            jurusan: jurusan ? String(jurusan).trim() : null,
            kelas3: kelas3 ? String(kelas3).trim() : null,
            noHp: noHp ? String(noHp).trim() : null,
            alamat: alamat ? String(alamat).trim() : null,
          },
        });
        inserted.push({ nis, nama });
      } catch (err: any) {
        if (err.code === 'P2002') {
          errors.push({ row: i + 2, message: `Duplicate NIS: ${nis}` });
        } else {
          errors.push({ row: i + 2, message: err.message });
        }
      }
    }

    return { inserted: inserted.length, errors, totalRows: rows.length - 1 };
  }

  async getStatus() {
    const [total, matched, unmatched] = await Promise.all([
      this.prisma.bukuIndukRef.count(),
      this.prisma.bukuIndukRef.count({ where: { isMatched: true } }),
      this.prisma.bukuIndukRef.count({ where: { isMatched: false } }),
    ]);

    return { total, matched, unmatched };
  }
}
