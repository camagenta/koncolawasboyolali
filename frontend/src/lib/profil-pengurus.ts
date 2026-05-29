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
    estimasiAngkatan: '1969',
    tahunLulus: '±1971',
    posisi: 'Wakil Menteri ESDM (2013-2014)',
    ringkasan: 'Lahir di Boyolali, 4 September 1950. Lulusan Mechanical Engineering ITB angkatan 1970. Karir 33 tahun di ExxonMobil sebagai Vice President. Wakil Menteri ESDM pada Kabinet Indonesia Bersatu II (Jan 2013). Alumni ITB.',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Susilo_Siswoutomo_Official.jpg/400px-Susilo_Siswoutomo_Official.jpg',
    gender: 'Laki-laki',
    sumber: 'Wikipedia, Kementerian ESDM, SK Ketum IKA SMANSA BOY 2023',
    kontak: { linkedin: 'https://linkedin.com/in/susilo-siswoutomo' }
  },
  {
    nama: 'Agus Irawan',
    namaLengkap: 'Agus Irawan, S.STP.',
    jabatan: 'Dewan Pembina - Anggota (ex-officio)',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1999',
    tahunLulus: '±2002',
    posisi: 'Bupati Boyolali (2025-2030)',
    ringkasan: 'Lahir di Ngemplak, Boyolali, 10 September 1983. Bupati Boyolali periode 2025-2030 (dilantik 20 Feb 2025). Sebelumnya ASN di Dispora Surakarta. Partai Gerindra. Menjabat ex-officio sebagai anggota Dewan Pembina.',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bupati_Boyolali_Agus_Irawan.png/400px-Bupati_Boyolali_Agus_Irawan.png',
    gender: 'Laki-laki',
    sumber: 'Wikipedia, KPU, Pemkab Boyolali'
  },
  {
    nama: 'Sumardi',
    namaLengkap: 'Mayjen TNI (Purn.) Sumardi',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1979',
    tahunLulus: '±1981',
    posisi: 'Pangdam V/Brawijaya (2015-2016)',
    ringkasan: 'Pernah menjabat sebagai Panglima Kodam V/Brawijaya. Setelah purnabakti aktif sebagai Wakil Komisaris Utama PT Pindad.',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Komando_Pembina_Doktrin%2C_Pendidikan_dan_Latihan_Sumardi.jpg/250px-Komando_Pembina_Doktrin%2C_Pendidikan_dan_Latihan_Sumardi.jpg',
    gender: 'Laki-laki',
    sumber: 'TNI AD, PT Pindad, Wikipedia, SK Ketum IKA SMANSA BOY 2023'
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
    posisi: 'Kepala Badan Pemulihan Aset Kejaksaan Agung (2024-2025)',
    ringkasan: 'Lahir di Boyolali, 5 Oktober 1965. Jaksa Agung Muda Intelijen (2022-2024), JAM Pengawasan (2020-2022). Ketua Umum Persatuan Jaksa Indonesia (PJI) 2021-2024.',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Jaksa_Agung_Muda_Bidang_Intelijen_Amir_Yanto.jpg/250px-Jaksa_Agung_Muda_Bidang_Intelijen_Amir_Yanto.jpg',
    gender: 'Laki-laki',
    sumber: 'Wikipedia, Kejaksaan Agung RI'
  },
  {
    nama: 'Hadi Pratomo',
    namaLengkap: 'Prof. dr. Hadi Pratomo, MPH, Dr.PH',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1969',
    tahunLulus: '±1971',
    posisi: 'Guru Besar FKM Universitas Indonesia',
    ringkasan: 'Guru Besar Departemen Pendidikan Kesehatan dan Ilmu Perilaku FKM UI. Pendidikan: Dr.PH Tulane University, MPH Tulane University, dr Universitas Indonesia. Bidang ajar: Perencanaan & Evaluasi Promosi Kesehatan, Advokasi Promosi Kesehatan.',
    foto: 'https://fkm.ui.ac.id/wp-content/uploads/2024/09/Prof-Hadi-600x800.jpeg',
    gender: 'Laki-laki',
    sumber: 'FKM UI (fkm.ui.ac.id)'
  },
  {
    nama: 'Sri Yunanto',
    namaLengkap: 'Prof. Drs. Sri Yunanto, M.Si., Ph.D.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1978',
    tahunLulus: '±1980',
    posisi: 'Guru Besar Ilmu Politik FISIP UMJ',
    ringkasan: 'Dikukuhkan sebagai Guru Besar FISIP UMJ bidang Ilmu Politik dan Humaniora (Jan 2026). PhD dari Universiti Sains Malaysia (2013). Orasi ilmiah: "Pengembangan Soft Power Menuju Indonesia Emas 2045". Dosen Ilmu Politik FISIP UMJ.',
    gender: 'Laki-laki',
    sumber: 'UMJ, Google Scholar, Media Indonesia, SINTA'
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
    ringkasan: 'Lahir di Boyolali, 15 Agustus 1968. Lulusan Akpol 1991. Sebelumnya Wakapolda Jawa Tengah. Menjabat Kakorlantas Polri sejak Jan 2025. Menerima Presisi Award 2026.',
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
    nama: 'Suwarno',
    namaLengkap: 'Prof. Dr. Ir. Suwarno, M.T.',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1985',
    tahunLulus: '±1987',
    posisi: 'Guru Besar Teknik Elektro ITB',
    ringkasan: 'Guru Besar Teknik Elektro ITB sejak 2010. S1 ITB (1988), S2 ITB (1991), PhD Nagoya University Jepang (1996). Top 2% ilmuwan paling berpengaruh dunia versi Stanford University (2021–2025). Mantan Dekan STEI ITB (2011–2015). Senior Member IEEE. Editor-in-Chief IJEEI.',
    foto: 'https://itb.ac.id/files/dosen/1536-d3dcd904b2a4453733aa5fab94141d3d9482f2bc23c960e55a729ae3041d8fb3.png',
    gender: 'Laki-laki',
    sumber: 'ITB (stei.itb.ac.id), Wikipedia'
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
    nama: 'Tatik Saroso',
    namaLengkap: 'Tatik Saroso',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1967',
    tahunLulus: '±1969',
    posisi: 'Ketua Bidang II (Organisasi dan Sosial) Reuni Akbar 2013',
    ringkasan: 'Aktif dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013 sebagai Ketua Bidang Organisasi dan Sosial.',
    gender: 'Perempuan',
    sumber: 'Bangashari.ID, SK Ketum IKA SMANSA BOY 2023'
  },
  {
    nama: 'Djoepri Bandang',
    namaLengkap: 'Dr. Djoepri Bandang',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1967',
    tahunLulus: '±1969',
    gender: 'Laki-laki',
    posisi: 'Pengurus IKA SMANSA BOY periode 2022-2025',
    ringkasan: 'Anggota Dewan Pembina IKA SMANSA BOY periode 2022-2025 sesuai SK Ketum IKA SMANSA BOY 2023.',
    sumber: 'SK Ketum IKA SMANSA BOY 2023'
  },
  {
    nama: 'Marsusi',
    namaLengkap: 'Drs. Marsusi',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1969',
    tahunLulus: '±1971',
    gender: 'Laki-laki',
    posisi: 'Pengurus IKA SMANSA BOY periode 2022-2025',
    ringkasan: 'Anggota Dewan Pembina IKA SMANSA BOY periode 2022-2025 sesuai SK Ketum IKA SMANSA BOY 2023.',
    sumber: 'SK Ketum IKA SMANSA BOY 2023'
  },
  {
    nama: 'Agung Wardoyo',
    namaLengkap: 'Agung Wardoyo',
    jabatan: 'Dewan Pembina - Anggota',
    kategori: 'dewan-pembina',
    estimasiAngkatan: '1981',
    tahunLulus: '±1983',
    gender: 'Laki-laki',
    posisi: 'Pengurus IKA SMANSA BOY periode 2022-2025',
    ringkasan: 'Anggota Dewan Pembina IKA SMANSA BOY periode 2022-2025 sesuai SK Ketum IKA SMANSA BOY 2023.',
    sumber: 'SK Ketum IKA SMANSA BOY 2023'
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
    ringkasan: 'Lahir di Boyolali, 15 Maret 1957. S1 Ekonomi UNS (1983), MSc University of Illinois (1993), PhD Financial Economics Loughborough University (1999). Guru Besar Manajemen Risiko UNS. Kepala Perwakilan BI New York (2012). Dirut Bank Mandiri. Ketua DK OJK 2017-2022.',
    foto: 'https://cdn.antaranews.com/cache/1200x800/2022/05/23/IMG_20220523_113014.jpg',
    gender: 'Laki-laki',
    sumber: 'OJK, Antara News',
    kontak: { linkedin: 'https://linkedin.com/in/wimboh-santosa' }
  },
  {
    nama: 'Sulaiman Arif Arianto',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1976',
    tahunLulus: '±1978',
    posisi: 'Wakil Direktur Utama PT Bank Mandiri Tbk (2015-2020)',
    ringkasan: 'Lahir di Boyolali 1959. S1 Peternakan IPB (1981), MBA University of New Orleans (1991). Karir di BRI (1983-2015): Direktur Micro & Small Business, Direktur Commercial Banking. Wakil Direktur Utama Bank Mandiri (2015-2020). Komisaris Independen Indofood. Founder Islamic School Al-A\'raf Persada Indonesia. Owner PT Nugraha Aria Sadana.',
    gender: 'Laki-laki',
    sumber: 'Bank Mandiri, Indofood, Cemplung.com, SK Ketum IKA SMANSA BOY 2023',
    kontak: { linkedin: 'https://linkedin.com/in/sulaiman-arif-arianto', instagram: 'https://instagram.com/sulaimanarif' }
  },
  {
    nama: 'Gatot Darmasto',
    namaLengkap: 'Drs. Gatot Darmasto, Ak., MBA., CFrA., CA., CRMA., QIA.',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1977',
    tahunLulus: '±1979',
    posisi: 'Mantan Deputi BPKP — Komisaris IFG',
    ringkasan: 'Mantan Deputi Kepala BPKP Bidang Pengawasan Penyelenggaraan Keuangan Daerah. Komisaris di IFG (Indonesia Financial Group). Juga menjabat sebagai Deputi Bidang Akuntan Negara BPKP. Asesor tersertifikasi BNSP.',
    gender: 'Laki-laki',
    sumber: 'BPKP, Antara News, BNSP, Jenova.ai OSINT, SK Ketum IKA SMANSA BOY 2023'
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
    estimasiAngkatan: '1982',
    tahunLulus: '±1984',
    posisi: 'Guru di Dinas Pendidikan Pemuda & Olahraga',
    ringkasan: 'Seorang pendidik di lingkungan Dinas Pendidikan. Aktif dalam kepanitiaan Reuni Akbar SMPN 1 dan SMAN 1 Boyolali tahun 2013 sebagai Koordinator Seksi Pemberian Awards.',
    gender: 'Laki-laki',
    sumber: 'Bangashari.ID, LinkedIn, SK Ketum IKA SMANSA BOY 2023'
  },
  {
    nama: 'Jaka Pujiyono',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    estimasiAngkatan: '1982',
    tahunLulus: '±1984',
    posisi: 'Senior Partner di Deloitte Indonesia',
    ringkasan: 'Senior Partner di Deloitte Indonesia. Latar belakang industri penerbangan (Indonesian Airline) dan alumni IPB.',
    gender: 'Laki-laki',
    sumber: 'LinkedIn, Jenova.ai OSINT, SK Ketum IKA SMANSA BOY 2023',
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
    foto: 'https://asset-2.tribunnews.com/tribunnewswiki/foto/bank/images/Hartanto-Wibowo-2.jpg',
    ringkasan: 'Lahir di Boyolali, 9 Februari 1976. Karir di PT PLN sejak 2003. Pernah menjabat sebagai Direktur Energi Primer PLN (2022) dan Direktur Keuangan & SDM PT PLN Batubara. Diangkat sebagai Direktur Perencanaan Korporat & Pengembangan Bisnis PLN pada September 2022.',
    gender: 'Laki-laki',
    sumber: 'PLN, CNN Indonesia, CNBC Indonesia'
  },
  {
    nama: 'Wartono',
    jabatan: 'Dewan Pengawas - Anggota',
    kategori: 'dewan-pengawas',
    gender: 'Laki-laki',
    posisi: 'Belum ditemukan data publik',
    kontak: { instagram: 'https://instagram.com/wartonoboyolali' }
  },

  // ==================== PENGURUS PUSAT ====================
  {
    nama: 'Didik Haryadi',
    namaLengkap: 'H. Didik Haryadi, S.T., S.H., M.H.',
    jabatan: 'Ketua Umum',
    kategori: 'pengurus-pusat',
    posisi: 'Anggota DPR RI - Komisi XI (Fraksi PDIP)',
    ringkasan: 'Lahir di Boyolali, 12 November 1976. Anggota DPR RI Dapil Jawa Tengah V (Boyolali, Solo, Sukoharjo) periode 2024-2029 — Komisi XI (Keuangan). Ketua IKA Boy (Ikatan Alumni Boyolali). S1 Teknik Informatika Universitas Pelita Bangsa, S1 Hukum & S2 MH Universitas Krisnadwipayana. Dikenal aksi jalan kaki Jakarta-Boyolali 540 km sebagai nazar.',
    foto: 'https://infopemilu.kpu.go.id/berkas-calon/dprri/1683880747_baed8ef8-540a-4cc4-a2f0-578975edb3fa.jpeg',
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
    namaLengkap: 'Drs. H. Ali Mahfud, S.H.',
    jabatan: 'Ketua Harian II',
    kategori: 'pengurus-pusat',
    gender: 'Laki-laki',
    estimasiAngkatan: '1980',
    tahunLulus: '±1982',
    posisi: 'Hakim Pengadilan Agama Surakarta',
    ringkasan: 'Lahir di Boyolali, 6 Desember 1964. Hakim di Pengadilan Agama Surakarta. Sebelumnya bertugas di PA Kebumen, PA Bulukumba, PA Selong, PA Praya, dan PA Demak.',
    sumber: 'pa-surakarta.go.id, putusan.mahkamahagung.go.id'
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
    estimasiAngkatan: '1985',
    tahunLulus: '±1987',
    gender: 'Perempuan',
    posisi: 'Anggota Dewan Pakar IKA SMANSA BOY periode 2022-2025',
    ringkasan: 'Anggota Dewan Pakar IKA SMANSA BOY periode 2022-2025 sesuai SK Ketum IKA SMANSA BOY 2023 (Dr. Subekti Nurmawati).',
    sumber: 'SK Ketum IKA SMANSA BOY 2023'
  },
  {
    nama: 'Risdianto',
    jabatan: 'Bendahara Umum',
    kategori: 'pengurus-pusat',
    estimasiAngkatan: '1984',
    tahunLulus: '±1986',
    gender: 'Laki-laki',
    posisi: 'Anggota Dewan Penasehat IKA SMANSA BOY periode 2022-2025',
    ringkasan: 'Anggota Dewan Penasehat IKA SMANSA BOY periode 2022-2025 sesuai SK Ketum IKA SMANSA BOY 2023.',
    sumber: 'SK Ketum IKA SMANSA BOY 2023'
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
    posisi: 'Direktur SDM PT Pertamina (Persero)',
    ringkasan: 'Diangkat sebagai Direktur SDM PT Pertamina (Persero) pada Juni 2025. Sebelumnya Marketing Director PT Pertamina Trans Kontinental. Pengalaman 22+ tahun di Pertamina Group. MBA Energy Business Management UGM.',
    sumber: 'LinkedIn, Equilar, Kementerian BUMN',
    kontak: { linkedin: 'https://linkedin.com/in/andyarvianto' }
  },
  {
    nama: 'Bambang Widjajarso',
    jabatan: 'Wakil Ketua Bidang Pengembangan Organisasi',
    kategori: 'bidang',
    gender: 'Laki-laki',
    posisi: 'Trainer Kepemimpinan & Soft Skills — Pusdiklat PSDM Kemenkeu',
    ringkasan: 'Internal Audit Trainer di Pusdiklat SDM Kementerian Keuangan sejak 1994, menjadi trainer leadership & soft skills sejak 2009. Juga dosen di STAN.',
    sumber: 'LinkedIn',
    kontak: { linkedin: 'https://linkedin.com/in/bambang-widjajarso-6044494a', instagram: 'https://instagram.com/widjajarso' }
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
    posisi: 'IT Support & Data — BPS / ASN',
    ringkasan: 'Profesional IT di lingkungan pemerintahan (BPS). Aktif sebagai pemateri reformasi birokrasi & pengembangan ASN. Bergabung di PrakomID (Asosiasi Pranata Komputer Indonesia) dan Yayasan HSI AbdullahRoy sebagai IT Support Dakwah. Handle digital: @camagenta / Kuro.',
    sumber: 'LinkedIn, Instagram, GitHub, Facebook',
    kontak: {
      linkedin: 'https://id.linkedin.com/in/kurniaadhi',
      instagram: 'https://www.instagram.com/camagenta/',
      email: 'tersedia di profil LinkedIn'
    }
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
    estimasiAngkatan: '1981',
    tahunLulus: '±1983',
    gender: 'Laki-laki',
    posisi: 'Anggota Dewan Penasehat IKA SMANSA BOY periode 2022-2025',
    ringkasan: 'Anggota Dewan Penasehat IKA SMANSA BOY periode 2022-2025 sesuai SK Ketum IKA SMANSA BOY 2023.',
    sumber: 'SK Ketum IKA SMANSA BOY 2023'
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
