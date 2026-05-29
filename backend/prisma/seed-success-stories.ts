/**
 * Seed script for Success Stories (Alumni Berprestasi)
 *
 * Usage: npx tsx prisma/seed-success-stories.ts
 * 
 * Populates the success_stories table with notable alumni profiles
 * from the Pengurus IKA data. Only inserts if table is empty.
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const stories = [
  { name: 'Susilo Siswoutomo', angkatan: 1970, achievement: 'Wakil Menteri Keuangan RI (2014–2016)', description: 'Lulusan ITB yang menjabat sebagai Wakil Menteri Keuangan RI periode 2014–2016. Berpengalaman di Badan Kebijakan Fiskal Kementerian Keuangan.', isFeatured: true },
  { name: 'Agus Irawan', angkatan: 1978, achievement: 'Bupati Boyolali (2025–2030)', description: 'Bupati Boyolali terpilih periode 2025–2030. Sebelumnya menjabat sebagai Kepala Dinas Pekerjaan Umum dan Penataan Ruang Provinsi Jawa Tengah.', isFeatured: true },
  { name: 'Wimboh Santoso', angkatan: 1983, achievement: 'Ketua Dewan Komisioner OJK (2017–2022)', description: 'Ketua Dewan Komisioner Otoritas Jasa Keuangan (OJK) periode 2017–2022. PhD dari Loughborough University, Inggris.', isFeatured: true },
  { name: 'Prof. Suwarno', angkatan: 1986, achievement: 'Guru Besar Teknik Elektro ITB — Top 2% Ilmuwan Dunia', description: 'Profesor di Sekolah Teknik Elektro dan Informatika ITB. Masuk dalam daftar Top 2% Scientists Worldwide versi Stanford University.', isFeatured: true },
  { name: 'Sumardi', angkatan: 1977, achievement: 'Mayjen TNI (Purn.) — Dirjen Pothan Kemhan RI', description: 'Mayor Jenderal TNI (Purn.) yang menjabat sebagai Direktur Jenderal Potensi Pertahanan Kementerian Pertahanan RI.', isFeatured: true },
  { name: 'Djoko Kirmanto', angkatan: 1972, achievement: 'Menteri Pekerjaan Umum RI (2009–2014)', description: 'Menteri Pekerjaan Umum RI pada Kabinet Indonesia Bersatu II. Alumni ITB yang berkiprah di bidang infrastruktur nasional.', isFeatured: true },
  { name: 'Drs. H. Ali Mahfud, S.H.', angkatan: 1985, achievement: 'Hakim PA Surakarta Kelas IA', description: 'Hakim pada Pengadilan Agama Surakarta Kelas IA. Alumni Fakultas Syariah IAIN Walisongo dan Fakultas Hukum UNS.', isFeatured: true },
  { name: 'Mulyono', angkatan: 1970, achievement: 'Jenderal TNI (Purn.) — Panglima TNI (2015–2017)', description: 'Panglima Tentara Nasional Indonesia periode 2015–2017. Sebelumnya menjabat sebagai KSAD (2014–2015).', isFeatured: true },
  { name: 'Erwin Triwanto', angkatan: 1984, achievement: 'Irjen Pol — Kapolda Jawa Timur', description: 'Inspektur Jenderal Polisi yang menjabat sebagai Kepala Kepolisian Daerah Jawa Timur.', isFeatured: true },
  { name: 'Andy Arvianto', angkatan: 1994, achievement: 'Direktur SDM PT Pertamina (2025)', description: 'Direktur Sumber Daya Manusia PT Pertamina (Persero). Berpengalaman di bidang HR dan organisasi di lingkungan BUMN.', isFeatured: true },
  { name: 'Didik Haryadi', angkatan: 1995, achievement: 'Kepala BPSDM Kemendagri RI', description: 'Kepala Badan Pengembangan Sumber Daya Manusia Kementerian Dalam Negeri RI.', isFeatured: true },
  { name: 'Kurnia Adhiwibowo', angkatan: 2002, achievement: 'Deputi Kepala BPS RI', description: 'Deputi di Badan Pusat Statistik RI. Salah satu alumni termuda yang menduduki jabatan strategis di tingkat nasional.', isFeatured: true },
  { name: 'Prof. Dr. Hartanto, M.Si.', angkatan: 1985, achievement: 'Guru Besar Ilmu Administrasi FISIP UNS', description: 'Guru Besar Ilmu Administrasi di Fakultas Ilmu Sosial dan Ilmu Politik Universitas Sebelas Maret Surakarta.', isFeatured: false },
  { name: 'Bambang Widjajarso', angkatan: 1976, achievement: 'Trainer Ahli Pusdiklat PSDM Kementerian Keuangan', description: 'Trainer dan ahli di Pusat Pendidikan dan Pelatihan Pengembangan Sumber Daya Manusia Kementerian Keuangan RI.', isFeatured: false },
  { name: 'Adi Surya Tri Wibowo', angkatan: 2001, achievement: 'Ketua Umum HDII — Desainer Grafis Nasional', description: 'Ketua Umum Himpunan Desainer Interior Indonesia (HDII) dan desainer grafis nasional.', isFeatured: false },
  { name: 'Ibnu Hadyanto', angkatan: 1995, achievement: 'VP Digital Lifestyle Telkom Group', description: 'Vice President Digital Lifestyle di Telkom Group. Berperan dalam pengembangan ekosistem digital nasional.', isFeatured: false },
  { name: 'Sumarno', angkatan: 1980, achievement: 'Sekretaris Daerah Provinsi Jawa Tengah', description: 'Sekretaris Daerah (Sekda) Provinsi Jawa Tengah. Menjabat sebagai kepala birokrasi Pemerintah Provinsi Jawa Tengah.', isFeatured: true },
  { name: 'Hadi Pratomo', angkatan: 1988, achievement: 'Komisaris Utama BPD Jateng', description: 'Komisaris Utama Bank Pembangunan Daerah Jawa Tengah. Berpengalaman di bidang perbankan dan keuangan daerah.', isFeatured: false },
];

async function main() {
  const count = await prisma.successStory.count();
  if (count > 0) {
    console.log(`Table already has ${count} entries. Skipping seed.`);
    return;
  }

  console.log('Seeding success stories...');
  for (const story of stories) {
    await prisma.successStory.create({ data: story });
  }
  console.log(`Seeded ${stories.length} success stories.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
