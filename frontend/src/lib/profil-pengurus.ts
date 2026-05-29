export interface Profile {
  nama: string
  namaLengkap?: string
  jabatan: string
  kategori: 'dewan-pembina' | 'dewan-pengawas' | 'pengurus-pusat' | 'bidang'
  estimasiAngkatan?: string
  tahunLulus?: string
  posisi?: string
  ringkasan?: string
  foto?: string
  gender?: 'Laki-laki' | 'Perempuan'
  sumber?: string
  kontak?: { linkedin?: string; instagram?: string; email?: string }
}

export const profiles: Profile[] = [
  // ==================== DEWAN PEMBINA ====================
  {
    nama: 'Susilo Siswoutomo',
    jabatan: 'Dewan Pembina - Ketua',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1968',
    tahunLulus: '±1970',
    posisi: 'Wakil Menteri ESDM (2013-2014)',
    ringkasan: 'Lulusan ITB Mechanical Engineering. Karir 33 tahun di ExxonMobil sebagai Vice President. Menjabat Wakil Menteri Energi dan Sumber Daya Mineral pada Kabinet Indonesia Bersatu II.',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Susilo_Siswoutomo_Official.jpg/400px-Susilo_Siswoutomo_Official.jpg',
    gender: 'Laki-laki',
    sumber: 'Wikipedia, Kementerian ESDM',
    kontak: { linkedin: 'https://linkedin.com/in/susilo-siswoutomo' }
  },
  {
    nama: 'Kandiyono',
    namaLengkap: 'Kandiyono, S.H., M.Hum.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1990',
    tahunLulus: '±1992',
    posisi: 'Bupati Boyolali (2025-2030)',
    ringkasan: 'Bupati Boyolali periode 2025-2030. Menjabat sebagai anggota Dewan Pembina secara ex-officio.',
    gender: 'Laki-laki',
    sumber: 'Pemkab Boyolali'
  },
  {
    nama: 'Sumardi',
    namaLengkap: 'Mayjen TNI (Purn.) Sumardi',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1974',
    tahunLulus: '±1977',
    posisi: 'Pangdam V/Brawijaya (2015-2016)',
    ringkasan: 'Pernah menjabat sebagai Panglima Kodam V/Brawijaya. Setelah purnabakti aktif sebagai Wakil Komisaris Utama PT Pindad.',
    gender: 'Laki-laki',
    sumber: 'TNI AD, PT Pindad'
  },
  {
    nama: 'Dun Sridadi',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Amir Yanto',
    namaLengkap: 'Dr. Amir Yanto, S.H., M.M., M.H.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1981',
    tahunLulus: '±1983',
    posisi: 'Kepala Badan Pemulihan Aset Kejagung',
    ringkasan: 'Pernah menjabat sebagai Jaksa Agung Muda Intelijen (Jamintel) dan Kepala Badan Pemulihan Aset Kejaksaan Agung.',
    gender: 'Laki-laki',
    sumber: 'Kejaksaan Agung RI'
  },
  {
    nama: 'Hadi Pratomo',
    namaLengkap: 'Prof. dr. Hadi Pratomo, MPH, Dr.PH',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1968',
    tahunLulus: '±1970',
    posisi: 'Guru Besar FKM Universitas Indonesia',
    ringkasan: 'Guru Besar di Fakultas Kesehatan Masyarakat Universitas Indonesia.',
    gender: 'Laki-laki',
    sumber: 'Universitas Indonesia'
  },
  {
    nama: 'Sri Yunanto',
    namaLengkap: 'Prof. Drs. Sri Yunanto, M.Si., Ph.D.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1978',
    tahunLulus: '±1980',
    posisi: 'Guru Besar Ilmu Politik UMJ',
    ringkasan: 'Guru Besar Ilmu Politik Universitas Muhammadiyah Jakarta, dikukuhkan tahun 2026.',
    gender: 'Laki-laki',
    sumber: 'UMJ'
  },
  {
    nama: 'Noorlailie Soewarno',
    namaLengkap: 'Prof. Dr. Noorlailie Soewarno, SE., MBA., Ak.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1980',
    tahunLulus: '±1983',
    posisi: 'Guru Besar FEB Universitas Airlangga',
    ringkasan: 'Guru Besar di Fakultas Ekonomi dan Bisnis Universitas Airlangga.',
    gender: 'Perempuan',
    sumber: 'Universitas Airlangga'
  },
  {
    nama: 'Agus Suryonugroho',
    namaLengkap: 'Irjen Pol. Agus Suryonugroho, S.H., M.Hum.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1984',
    tahunLulus: '±1986',
    posisi: 'Kakorlantas Polri',
    ringkasan: 'Menjabat sebagai Kepala Korps Lalu Lintas Polri sejak Januari 2025.',
    foto: 'https://cdn.antaranews.com/cache/1200x800/2025/03/25/IMG-20250325-WA0009.jpg',
    gender: 'Laki-laki',
    sumber: 'Polri, Antara News'
  },
  {
    nama: 'Haryanto WS',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1982',
    tahunLulus: '±1984',
    posisi: 'Direktur Bisnis Regional Jawa Madura Bali, PT PLN',
    ringkasan: 'Direktur Bisnis Regional Jawa Madura Bali PT PLN (Persero).',
    gender: 'Laki-laki',
    sumber: 'PT PLN (Persero)'
  },
  {
    nama: 'Yusroni',
    namaLengkap: 'H. Yusroni, S.H.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    posisi: 'Ketua Perkumpulan Keluarga Besar Boyolali (PKBB)',
    ringkasan: 'Tokoh masyarakat Boyolali. Ketua Perkumpulan Keluarga Besar Boyolali (PKBB) dan Ketua Paguyuban Masyarakat Boyolali. Aktif dalam kegiatan sosial kemasyarakatan.',
    gender: 'Laki-laki',
    sumber: 'CNN Indonesia, Metro TV, Tabloid Lugas'
  },
  {
    nama: 'Ibnu Widodo',
    namaLengkap: 'Drs. H. Ibnu Widodo, M.M.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    posisi: 'Sesepuh Paguyuban Alumni Boyolali (PAKDE)',
    ringkasan: 'Tokoh sesepuh Paguyuban Alumni Boyolali. Juga dikenal sebagai aktor senior Indonesia dengan nama panggung Ibnu Gundul dengan lebih dari 80 judul film.',
    gender: 'Laki-laki',
    sumber: 'Tabloid Lugas, Film Indonesia'
  },
  {
    nama: 'Tati Saroso',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    posisi: 'Ketua Bidang II (Organisasi dan Sosial) Reuni Akbar 2013',
    ringkasan: 'Aktif dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013 sebagai Ketua Bidang Organisasi dan Sosial.',
    gender: 'Perempuan',
    sumber: 'Bangashari.ID'
  },

  // ==================== DEWAN PENGAWAS ====================
  {
    nama: 'Wimboh Santosa',
    namaLengkap: 'Prof. Wimboh Santosa, S.E., M.Sc., Ph.D.',
    jabatan: 'Dewan Pengawas - Ketua',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1973',
    tahunLulus: '±1975',
    posisi: 'Ketua Dewan Komisioner OJK (2017-2022)',
    ringkasan: 'Guru Besar Ekonomi UNS. Mantan Direktur Eksekutif IMF. Ketua Dewan Komisioner Otoritas Jasa Keuangan periode 2017-2022.',
    foto: 'https://cdn.antaranews.com/cache/1200x800/2022/05/23/IMG_20220523_113014.jpg',
    gender: 'Laki-laki',
    sumber: 'OJK, Antara News',
    kontak: { linkedin: 'https://linkedin.com/in/wimboh-santosa' }
  },
  {
    nama: 'Sulaiman Arif Arianto',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1977',
    tahunLulus: '±1979',
    posisi: 'Wakil Direktur Utama PT Bank Mandiri Tbk (2015-2020)',
    ringkasan: 'Lahir di Boyolali 1959. S1 Peternakan IPB (1981), MBA University of New Orleans (1991). Karir di BRI (1983-2015): Direktur Micro & Small Business, Direktur Commercial Banking. Wakil Direktur Utama Bank Mandiri (2015-2020). Komisaris Independen Indofood. Founder Islamic School Al-A\'raf Persada Indonesia. Owner PT Nugraha Aria Sadana.',
    gender: 'Laki-laki',
    sumber: 'Bank Mandiri, Indofood, Cemplung.com',
    kontak: { linkedin: 'https://linkedin.com/in/sulaiman-arif-arianto', instagram: 'https://instagram.com/sulaimanarif' }
  },
  {
    nama: 'Gatot Darmasto',
    namaLengkap: 'Drs. Gatot Darmasto, Ak., MBA., CFrA., CA., CRMA., QIA.',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    posisi: 'Mantan Deputi BPKP — Komisaris IFG',
    ringkasan: 'Mantan Deputi Kepala BPKP Bidang Pengawasan Penyelenggaraan Keuangan Daerah. Komisaris di IFG (Indonesia Financial Group). Juga menjabat sebagai Deputi Bidang Akuntan Negara BPKP. Asesor tersertifikasi BNSP.',
    gender: 'Laki-laki',
    sumber: 'BPKP, Antara News, BNSP, Jenova.ai OSINT'
  },
  {
    nama: 'Sayoeti Sukandi',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Firdaus Muchtar',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    posisi: 'Guru di Dinas Pendidikan Pemuda & Olahraga',
    ringkasan: 'Seorang pendidik di lingkungan Dinas Pendidikan. Aktif dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013 sebagai Koordinator Seksi Pemberian Awards.',
    gender: 'Laki-laki',
    sumber: 'Bangashari.ID, LinkedIn'
  },
  {
    nama: 'Jaka Pujiyono',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    posisi: 'Senior Partner di Deloitte Indonesia',
    ringkasan: 'Senior Partner di Deloitte Indonesia. Latar belakang industri penerbangan (Indonesian Airline) dan alumni IPB.',
    gender: 'Laki-laki',
    sumber: 'LinkedIn, Jenova.ai OSINT',
    kontak: { linkedin: 'https://linkedin.com/in/jaka-pujiyono' }
  },
  {
    nama: 'Aloys Sutarto',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    posisi: 'CEO/Founder MultiIntegra Technology Group',
    ringkasan: 'Founder dan CEO MultiIntegra Technology Group (MITG). Juga pemilik MaxOne Hotel Loji Kridanggo Boyolali (hotel bintang tiga tertinggi di Boyolali). Pembina Yayasan Kuas Global Academia bidang pendidikan perhotelan. Background di bidang teknologi informasi.',
    gender: 'Laki-laki',
    sumber: 'ANTARA News, Fokus Jateng, JATENGPOS'
  },
  {
    nama: 'Bambang Supardi',
    namaLengkap: 'Mayjen TNI (Purn.) Bambang Supardi',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    posisi: 'Staf Khusus Kasad (Kepala Staf Angkatan Darat)',
    ringkasan: 'Alumni Akademi Militer 1988, kecabangan Kavaleri. Purnawirawan TNI bintang dua. Setelah purnabakti aktif di politik.',
    gender: 'Laki-laki',
    sumber: 'Wahana News, Merdeka.com, ANTARA News'
  },
  {
    nama: 'Imam Santosa',
    namaLengkap: 'Prof. Imam Santosa',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1985',
    tahunLulus: '±1987',
    posisi: 'Guru Besar Etnomusikologi, ISI Surakarta',
    ringkasan: 'Guru Besar bidang Etnomusikologi di Institut Seni Indonesia (ISI) Surakarta.',
    gender: 'Laki-laki',
    sumber: 'ISI Surakarta'
  },
  {
    nama: 'Hartanto Wibowo',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1991',
    tahunLulus: '±1993',
    posisi: 'Direktur Perencanaan Korporat & Pengembangan Bisnis PT PLN',
    ringkasan: 'Lahir di Boyolali, 9 Februari 1976. Karir di PT PLN sejak 2003. Pernah menjabat sebagai Direktur Energi Primer PLN (2022) dan Direktur Keuangan & SDM PT PLN Batubara. Diangkat sebagai Direktur Perencanaan Korporat & Pengembangan Bisnis PLN pada September 2022.',
    gender: 'Laki-laki',
    sumber: 'PLN, CNN Indonesia, CNBC Indonesia'
  },
  {
    nama: 'Wartono',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },

  // ==================== PENGURUS PUSAT ====================
  {
    nama: 'Didik Haryadi',
    namaLengkap: 'H. Didik Haryadi, S.T., S.H., M.H.',
    jabatan: 'Ketua Umum',
    kategori: 'pengurus-pusat',
    posisi: 'Anggota DPR RI - Komisi XI (Fraksi PDIP)',
    ringkasan: 'Anggota DPR RI Dapil Jawa Tengah V periode 2024-2029. Ketua IKA Boy (Ikatan Alumni Boyolali). Lulusan Universitas Pelita Bangsa & Universitas Krisnadwipayana. Pengusaha dan politisi PDIP. Dikenal aksi jalan kaki Jakarta-Boyolali 540 km sebagai nazar.',
    gender: 'Laki-laki',
    sumber: 'DPR RI, Espos.id, TribunSolo',
    kontak: { instagram: 'https://instagram.com/didikharyadi', linkedin: 'https://linkedin.com/in/didik-haryadi' }
  },
  {
    nama: 'Ibnu Hadyanto',
    jabatan: 'Ketua Harian I',
    kategori: 'pengurus-pusat',
    posisi: 'Head of Project Development Maritime Logistics di PT Telkom Indonesia',
    gender: 'Laki-laki',
    ringkasan: 'Profesional di bidang maritim logistik dan pengembangan proyek di PT Telkom Indonesia. Aktif dalam kepengurusan IKA Boyolali.',
    sumber: 'Espos.id, LinkedIn',
    kontak: { linkedin: 'https://linkedin.com/in/ibnu-hadyanto', instagram: 'https://instagram.com/ibnuhadyanto' }
  },
  {
    nama: 'Ali Mahfud',
    jabatan: 'Ketua Harian II',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    posisi: 'Full Stack Engineer / Cluster IT Manager di MI Pakuwon Hotels Portfolio',
    ringkasan: '⚠️ Perlu verifikasi — nama "Ali Mahfud" umum. Profil ini paling relevan dengan latar belakang IT di Jawa Timur/Jakarta, tetapi belum terkonfirmasi sebagai alumni SMAN 1 Boyolali.',
    sumber: 'LinkedIn (perlu verifikasi)'
  },
  {
    nama: 'Yulianto',
    jabatan: 'Sekretaris Jenderal',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Adi Surya Tri Wibowo',
    jabatan: 'Sekretaris I',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    posisi: 'Founder Dimensi Gagas Prima',
    ringkasan: 'Profesional di bidang desain dan konstruksi arsitektur interior dengan pengalaman 25 tahun. Founder Dimensi Gagas Prima.',
    sumber: 'LinkedIn',
    kontak: { linkedin: 'https://linkedin.com/in/adi-surya-tri-wibowo' }
  },
  {
    nama: 'S. Nurmawati',
    jabatan: 'Sekretaris II',
    kategori: 'pengurus-pusat',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Risdianto',
    jabatan: 'Bendahara Umum',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Tri Hartono',
    jabatan: 'Bendahara I',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Chrismiyastuti',
    jabatan: 'Bendahara II',
    kategori: 'pengurus-pusat',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Gigih Fajar',
    jabatan: 'Urusan Dana Internal',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Sri Hastuti',
    jabatan: 'Urusan Kas dan Lapangan',
    kategori: 'pengurus-pusat',
    gender: 'Perempuan',
    posisi: 'Anggota Seksi Dana Reuni Akbar 2013',
    ringkasan: 'Terlibat dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013 sebagai anggota Seksi Dana.',
    sumber: 'Bangashari.ID'
  },

  // ==================== BIDANG ====================
  {
    nama: 'Andy Arvianto',
    jabatan: 'Ketua Bidang Pengembangan Organisasi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Bambang Widjayarso',
    jabatan: 'Wakil Ketua Bidang Pengembangan Organisasi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Joko Karsono',
    jabatan: 'Koordinator I Bidang Pengembangan Organisasi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    ringkasan: 'Pernah tercatat dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013.',
    sumber: 'Bangashari.ID'
  },
  {
    nama: 'Joko Suyono',
    jabatan: 'Koordinator II Bidang Pengembangan Organisasi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Gatot Rahmanto',
    jabatan: 'Sub Bidang Almamater',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Sri Sunarti P',
    jabatan: 'Anggota Sub Bidang Almamater',
    kategori: 'bidang',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Retno Purwaningsih',
    jabatan: 'Ketua Bidang Integrasi & Pemberdayaan Alumni',
    kategori: 'bidang',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Agus Wahyudi',
    jabatan: 'Wakil Ketua Bidang Integrasi & Pemberdayaan Alumni',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Fajar Eko Ananto',
    jabatan: 'Koordinator I Bidang Integrasi & Pemberdayaan Alumni',
    kategori: 'bidang',
    gender: 'Laki-laki',
    ringkasan: 'Pernah tercatat dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013 sebagai Sekretaris I.',
    sumber: 'Bangashari.ID'
  },
  {
    nama: 'Erlita Titis Dewi',
    jabatan: 'Koordinator II Bidang Integrasi & Pemberdayaan Alumni',
    kategori: 'bidang',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Kurnia Adhiwibowo',
    jabatan: 'Sub Bidang Database',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Koordinator Sub Bidang Database — Bidang Integrasi & Pemberdayaan Alumni',
    ringkasan: 'Tidak ditemukan profil publik signifikan. Kemungkinan profesional privat. Nama lengkap: Kurnia Adhiwibowo.',
    sumber: 'Jenova.ai OSINT — tidak ditemukan jejak digital publik'
  },
  {
    nama: 'Muh Imron',
    jabatan: 'Sub Bidang Sinergi Alumni',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Agus Winarno',
    jabatan: 'Ketua Bidang Ekonomi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Tri Setyo Utomo',
    jabatan: 'Wakil Ketua Bidang Ekonomi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Wargino',
    jabatan: 'Koordinator I Bidang Ekonomi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Dharu Nugroho',
    jabatan: 'Koordinator II Bidang Ekonomi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Eko Darmono',
    jabatan: 'Sub Bidang Dana dan Usaha',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Singgih Wirawan',
    jabatan: 'UMKM/Ekonomi Kreatif',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Wahono Sukarjo',
    jabatan: 'Ketua Bidang Partisipasi Sosial Masyarakat',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Menuk Sri Sugiarti',
    jabatan: 'Wakil Ketua Bidang Partisipasi Sosial Masyarakat',
    kategori: 'bidang',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Hari Setyono',
    jabatan: 'Koordinator I Bidang Partisipasi Sosial Masyarakat',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Gunawan Wibisono',
    jabatan: 'Koordinator II Bidang Partisipasi Sosial Masyarakat',
    kategori: 'bidang',
    gender: 'Laki-laki',
    ringkasan: 'Pernah tercatat dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013.',
    sumber: 'Bangashari.ID'
  },
  {
    nama: 'Kristiani',
    jabatan: 'Sub Bidang Silaturahmi Alumni',
    kategori: 'bidang',
    gender: 'Perempuan',
    posisi: 'Belum ditemukan data publik'
  },
  {
    nama: 'Yuni Etty',
    jabatan: 'Sub Bidang Sosial Masyarakat',
    kategori: 'bidang',
    gender: 'Perempuan',
    ringkasan: 'Pernah tercatat sebagai Bendahara I dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013.',
    sumber: 'Bangashari.ID'
  }
]
