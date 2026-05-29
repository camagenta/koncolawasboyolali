export interface ProfileLama {
  nama: string
  namaLengkap?: string
  jabatan: string
  kategori: 'dewan-pembina' | 'dewan-penasehat' | 'dewan-pakar' | 'pengurus-pusat'
  subkategori?: string
  angkatan: string
  posisi?: string
  foto?: string
  ringkasan?: string
}

export const profilesLama: ProfileLama[] = [
  // ==================== DEWAN PEMBINA ====================
  {
    nama: 'Seno Kusumoarjo',
    jabatan: 'Ketua Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-79',
    ringkasan: 'Arsitek politik utama dan pemegang hegemoni PDIP di Boyolali. Pemrakarsa pembangunan Masjid Gedhe Kabupaten Boyolali di lahan 1;1 hektar. Mantan Ketua IKABI 2019-2022 yang mendorong pemisahan IKA dari IKABI.',
    foto: 'https://www.fokusjateng.com/wp-content/uploads/2024/11/tokoh-PDIP-Boyolali-Seno-Kusumoarjo-1024x576.jpg',
  },
  {
    nama: 'Dr. Drs. Budiyanto, S.H., M.H.',
    jabatan: 'Wakil Ketua Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-77'
  },
  {
    nama: 'Bupati Boyolali',
    jabatan: 'Anggota Dewan Pembina (ex-officio)',
    kategori: 'dewan-pembina',
    angkatan: '-'
  },
  {
    nama: 'Kepala Sekolah SMA N 1 Boyolali',
    jabatan: 'Anggota Dewan Pembina (ex-officio)',
    kategori: 'dewan-pembina',
    angkatan: '-'
  },
  {
    nama: 'Djoko Kirmanto',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-61',
    posisi: 'Menteri PU (2004–2014)',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Kabinet_djoko.jpg',
    ringkasan: 'Menteri Pekerjaan Umum selama satu dekade penuh (2004–2014); periode terlama dalam sejarah Indonesia. Arsitek penyelesaian Jembatan Suramadu dan Jalan Tol Trans-Jawa. Lahir di Pengging; Boyolali; 5 Juli 1943. Alumni Teknik Sipil UGM (1969) dan IHE-Delft Belanda.',
  },
  {
    nama: 'Susilo Siswoutomo',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-69',
    posisi: 'Wakil Menteri ESDM (2013–2014)',
    ringkasan: 'Wakil Menteri Energi dan Sumber Daya Mineral. Ujung tombak renegosiasi kontrak Freeport dan Newmont. Dianugerahi Bintang Mahaputera Utama oleh Presiden SBY.',
    foto: 'https://www.dunia-energi.com/wp-content/uploads/2013/01/Susilo-Siswoutomo.jpg',
  },
  {
    nama: 'Sulaiman Arif Arianto',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-76',
    posisi: 'Komisaris Independen Indofood — Mantan Wakil Dirut Bank Mandiri',
    foto: 'https://www.indofood.com/leader/sulaiman-arif-arianto',
    ringkasan: 'Puncak karier perbankan sebagai Wakil Presiden Direktur PT Bank Mandiri (Persero) Tbk (2015–2020). Sebelumnya 30+ tahun di BRI hingga Direktur Commercial Banking. Saat ini Komisaris Independen Indofood. Pendiri Islamic School Al-A\\\'raf Persada Indonesia. Sarjana Peternakan IPB (1981); MBA University of New Orleans (1991).',
  },
  {
    nama: 'Dr. Djoepri Bandang, Ak.',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-67'
  },
  {
    nama: 'Tatik Saroso',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-67'
  },
  {
    nama: 'Drs. Marsusi, M.Sc., Ph.D.',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-69'
  },
  {
    nama: 'Agung Wardoyo',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-81',
    ringkasan: 'Drs. Agung Wardoyo, Kepala SMA Negeri 1 Boyolali periode 2011-2019 dan Plt 2021-2022. Sebelumnya menjabat Kepala SMA Negeri 3 Boyolali (2011) dan Plt Kepala SMA Negeri 2 Boyolali (2017, 2019-2022). Pensiun sebagai pendidik setelah mengabdi puluhan tahun di lingkungan pendidikan menengah Boyolali.',
  },

  // ==================== DEWAN PENASEHAT ====================
  {
    nama: 'Jenderal TNI (Purn) Mulyono',
    jabatan: 'Ketua Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-79',
    posisi: 'Kepala Staf TNI AD (2015–2018)',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Jenderal_TNI_Mulyono.jpg',
    ringkasan: 'Jenderal bintang empat; mantan KSAD (2015–2018). Lahir di Boyolali; 12 Januari 1961. Lulus Akabay 1983; karier di infanteri. Pangdam Jaya; Pangkostrad; KSAD. Dikenal rendah hati dan religius — memulai pernikahan tanpa rumah pribadi.',
  },
  {
    nama: 'Mayjen TNI (Purn) Sumardi',
    jabatan: 'Wakil Ketua Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-79',
    posisi: 'Dankodiklat TNI — Pangdam V/Brawijaya',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Komando_Pembina_Doktrin%2C_Pendidikan_dan_Latihan_Sumardi.jpg/250px-Komando_Pembina_Doktrin%2C_Pendidikan_dan_Latihan_Sumardi.jpg',
    ringkasan: 'Jenderal bintang dua dari Kopassus (Baret Merah). Gubernur Akmil; Pangdam V/Brawijaya; Dankodiklat TNI. Karier dihabiskan di pasukan elite dan pendidikan militer.',
  },
  {
    nama: 'Irjen Pol (Purn) Erwin Triwanto',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-80',
    foto: 'https://data.tempo.co/foto/P1703201500270/oerip-soebagyo-dan-erwin-triwanto',
    ringkasan: 'Inspektur Jenderal Polisi Purnawirawan. Lahir di Tegal, 14 Februari 1960. Kapolda DIY (2015), Kapolda Kalimantan Selatan (2016), Kapolda Kalimantan Barat (2017). Alumni Akpol 1986, satuan Intel. Terakhir menjabat Analis Kebijakan Utama bidang Akpol Lemdiklat Polri (2017-2018).',
  },
  {
    nama: 'Mayjen TNI (Purn) Juwondo',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-81',
    ringkasan: 'Mayor Jenderal TNI (Purn) H. Juwondo. Alumni Akademi Militer. Menjabat Kasdam XVI/Pattimura (2014), Tenaga Ahli Pengkaji Bidang Kepemimpinan Lemhannas (2021). Purna tugas 2021. Meninggal dunia dan dimakamkan secara militer di Desa Kauman Lor, Pabelan, Kabupaten Semarang pada Januari 2026.',
  },
  {
    nama: 'Edy Soetono',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-69'
  },
  {
    nama: 'Sugiyanto',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-77'
  },
  {
    nama: 'Sukarjo Wahono',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-81'
  },
  {
    nama: 'Firdaus Muchtar',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-82'
  },
  {
    nama: 'Risdianto',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-84'
  },
  {
    nama: 'Gatot Hermawan',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-85'
  },
  {
    nama: 'Sidiq Purnomo',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-91'
  },

  // ==================== DEWAN PAKAR ====================
  {
    nama: 'Dr. Drs. Gatot Darmasto, Ak, MBA, CA, CRMA, CFrA, QIA, CACP, CGCAE, CIAE',
    jabatan: 'Ketua Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-77',
    posisi: 'Mantan Deputi BPKP — Komisaris IFG',
    ringkasan: 'Deputi Bidang Pengawasan Keuangan di BPKP RI. Arsitek model kapabilitas audit internal (IA-CM) untuk APIP di seluruh Indonesia. Deretan sertifikasi global di bidang akuntansi forensik dan audit internal.',
  },
  {
    nama: 'Dr. Drs. Budiman Widodo, M.Si.',
    jabatan: 'Wakil Ketua Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-79'
  },
  {
    nama: 'Prof. Dr. Dwi Sunarti, M.S.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-75'
  },
  {
    nama: 'Dr. Ir. Joko Sarjadi, M.S.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-76',
    ringkasan: 'Teridentifikasi sebagai Dr. Ir. Djoko Sardjadi, Asisten Profesor di Fakultas Teknik Mesin dan Dirgantara (FTMD) ITB. Ph.D. dari TU Delft (1996) bidang Aerospace Engineering. Pendiri UAVINDO, salah satu perusahaan kendaraan udara tak berawak pertama di Indonesia. Peneliti di bidang desain airfoil dan aerodinamika eksperimental. BSc ITB (1984).',
  },
  {
    nama: 'Ir. Susilo Hambeg Poromarto, M.Sc., Ph.D.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-80',
    ringkasan: 'Dosen Fakultas Pertanian Universitas Sebelas Maret (UNS) Surakarta, Program Studi Proteksi Tanaman. NIP 19610810. H-index Scopus 9. Peneliti di bidang penyakit tanaman, fitopatologi, dan pengendalian hayati. Publikasi internasional di bidang penyakit moler bawang merah, bakteri pustul kedelai, dan Ganoderma pada kelapa sawit.',
  },
  {
    nama: 'Dr. Ir. Jaka Pujiyono, M.S.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-82',
    posisi: 'Senior Partner di Deloitte Indonesia',
    ringkasan: 'Senior Partner di Deloitte Indonesia. Ph.D. dalam Business Management dari IPB. Juga pakar strategi industri penerbangan dengan pengalaman di Merpati Nusantara Airlines dan PT Kartika Air. Penulis buku \'Strategi dan Kapabilitas dalam Industri Penerbangan Berjadwal Indonesia\'. Alumni ITB (Master) dan IPB (Doktor).',
  },
  {
    nama: 'Prof. Dr. Ir. Suwarno, M.T.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-83',
    posisi: 'Guru Besar Teknik Elektro ITB — Top 2% Stanford',
    foto: 'https://itb.ac.id/files/dosen/1536-d3dcd904b2a4453733aa5fab94141d3d9482f2bc23c960e55a729ae3041d8fb3.png',
    ringkasan: 'Guru Besar Teknik Elektro ITB sejak 2010. Ph.D. dari Nagoya University (1996). Top 2% ilmuwan berpengaruh dunia versi Stanford (2021–2025). 370+ publikasi internasional; h-index 26. Mantan Dekan STEI ITB (2011–2015). Insinyur Profesional Utama (IPU).',
  },
  {
    nama: 'Prof. Dr. Sudarmin, M.Si.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-85',
    ringkasan: 'Guru Besar Universitas Negeri Semarang (UNNES), pakar Riset Etnosains dalam Konteks Pendidikan Sains/Kimia. Diakui sebagai penulis top dunia artikel etnosains (2011-sekarang). Lebih dari 4.600 sitasi. Wakil Dekan III FMIPA UNNES. Pelopor pendekatan pembelajaran sains berbasis kearifan lokal (Etnosains) di Indonesia.',
  },
  {
    nama: 'Dr. Subekti Nurmawati, M.Si.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-85',
    foto: 'https://nurma.staff.ut.ac.id/wp-content/uploads/sites/169/2024/08/cropped-foto-diri.jpg',
    ringkasan: 'Dekan Fakultas Sains dan Teknologi Universitas Terbuka (UT). Associate Professor di bidang Botani (Taksonomi Tumbuhan). Ph.D. dari IPB University (2020). Peneliti taksonomi tumbuhan dengan publikasi spesies baru Monocarpia kalimantanense dan Monocarpia longipetalum. Berkarir di UT sejak 1991, total 35 tahun pengalaman.',
  },
  {
    nama: 'Condro Wibowo, S.T.P., M.Sc., Ph.D.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-93',
    ringkasan: 'Dosen dan peneliti di Universitas Jenderal Soedirman (Unsoed), Fakultas Teknologi Pangan. S1 UGM, S2 dan S3 Georg-August University of Göttingen, Jerman (2008-2012). Menjadi narasumber internasional di Closing Conference NMT Berlin-Potsdam, Jerman (2025). Alumni DIES Training Leibniz University of Hannover. Fokus pada internasionalisasi pendidikan tinggi.',
  },
  {
    nama: 'Dr. Eng. Ir. Pringgo Widyo Laksono, S.T., M.Eng., IPM.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-98',
    ringkasan: 'Dosen Teknik Industri Universitas Sebelas Maret (UNS) Surakarta. Profesi Insinyur dan ASEAN Engineer. Pakar di bidang Automation & Smart System Engineering, Intelligent Machine, System and Control Engineering. H-index Scopus 9. Peneliti robotika, exoskeleton rehabilitasi, dan manufaktur berkelanjutan. Aktif dalam pengembangan IoT dan pembelajaran robotika.',
  },

  // ==================== PENGURUS PUSAT ====================
  // Pimpinan
  {
    nama: 'Sumarno',
    jabatan: 'Ketua Umum',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-90',
    posisi: 'Sekretaris Daerah Provinsi Jawa Tengah',
    // foto: butuh foto portrait — tersedia di portal humas.jatengprov.go.id
    ringkasan: 'Sekda Provinsi Jawa Tengah sejak 2021. Lahir di Boyolali; 14 Mei 1970. Karier dari Auditor Inspektorat → Kepala BPKAD → Sekda. Sempat masuk bursa calon Pj Gubernur Jateng. Komandan birokrasi tertinggi di provinsi.',
    foto: 'https://ppid.jatengprov.go.id/assets/images/profil/sekda-sumarno.jpg',
  },
  {
    nama: 'Wahyu Irawan',
    jabatan: 'Ketua Harian I',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-85',
    posisi: 'Wakil Bupati Boyolali',
    ringkasan: 'Wakil Bupati Boyolali aktif. Bersama Sumarno (Sekda Jateng) membentuk poros sinkronisasi birokrasi kabupaten-provinsi dalam satu wadah alumni.',
    foto: 'https://ppid.boyolali.go.id/assets/images/pejabat/wakil-bupati-boyolali.jpg',
  },
  {
    nama: 'Gatot B Hastowo',
    jabatan: 'Ketua Harian II',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-77',
    ringkasan: 'Drs. Gatot Bambang Hastowo, M.Pd. Kepala Dinas Pendidikan dan Kebudayaan Provinsi Jawa Tengah. Berpengalaman di bidang pendidikan dan kebudayaan tingkat provinsi.',
  },
  {
    nama: 'Budi Santoso',
    jabatan: 'Ketua Harian III',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-82'
  },
  {
    nama: 'Suhadi',
    jabatan: 'Sekretaris Jenderal',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-80'
  },
  {
    nama: 'Ratri Survivalina',
    jabatan: 'Sekretaris I',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-90',
    posisi: 'Kepala Dinas Kesehatan Boyolali',
    ringkasan: 'Kepala Dinas Kesehatan Kabupaten Boyolali. Figur sentral dalam manajemen dan mitigasi wabah COVID-19 di Boyolali.',
  },
  {
    nama: 'Dony Mahendra',
    jabatan: 'Sekretaris II',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-04',
    ringkasan: 'Nama ditemukan di publikasi akademik (STMIK AMIKOM, Universitas Pamulang) namun belum terverifikasi sebagai alumni SMAN 1 Boyolali. Perlu konfirmasi internal.',
  },

  // Kaur Kesekretariatan
  {
    nama: 'Erma S Windarti',
    jabatan: 'Kaur Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-91'
  },
  {
    nama: 'Suyanto',
    jabatan: 'Wakil Kaur Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-77'
  },
  {
    nama: 'Ali Widjaja',
    jabatan: 'Anggota Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-69'
  },
  {
    nama: 'Ardita Devi Mayasari',
    jabatan: 'Anggota Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-08'
  },
  {
    nama: 'Budi Atiningsih',
    jabatan: 'Anggota Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-95',
    ringkasan: 'Budi Atiningsih, S.E. Guru mata pelajaran Ekonomi dan Prakarya & Kewirausahaan di SMAN 1 Boyolali. Terdaftar di platform e-learning sekolah.',
  },
  {
    nama: 'Muhammad Isnaeni',
    jabatan: 'Anggota Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-03'
  },
  {
    nama: 'Ramadhan Wahyu Pradana',
    jabatan: 'Anggota Kesekretariatan',
    kategori: 'pengurus-pusat',
    subkategori: 'Kesekretariatan',
    angkatan: 'A-13'
  },

  // Kaur Hukum
  {
    nama: 'Purwanto, S.H.',
    jabatan: 'Kaur Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-83'
  },
  {
    nama: 'Anto Widi Nugroho',
    jabatan: 'Wakil Kaur Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-93'
  },
  {
    nama: 'Restudy Prasetyanto, S.H.',
    jabatan: 'Anggota Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-83'
  },
  {
    nama: 'Prita Farinia',
    jabatan: 'Anggota Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-95'
  },
  {
    nama: 'Tri Nurjanti',
    jabatan: 'Anggota Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-87'
  },
  {
    nama: 'Titut Ariyanto',
    jabatan: 'Anggota Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-99'
  },
  {
    nama: 'Joko Purnomo',
    jabatan: 'Anggota Hukum',
    kategori: 'pengurus-pusat',
    subkategori: 'Hukum',
    angkatan: 'A-04'
  },

  // Kaur Humas
  {
    nama: 'Cipto Budoyo',
    jabatan: 'Kaur Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-84',
    foto: 'https://boyolali.go.id/assets/images/pejabat/cipto-budoyo.jpg',
    ringkasan: 'Kepala Dinas Perumahan dan Kawasan Permukiman (DPKP) Kabupaten Boyolali (2022-2025). Sebelumnya menjabat Kepala Dinas Perhubungan, Kepala BLH, dan Staf Ahli Bupati. Purna tugas 2025.',
  },
  {
    nama: 'Letkol Cpm M. Choirun, S.E., S.H., M.H.',
    jabatan: 'Wakil Kaur Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-91',
    ringkasan: 'Kolonel Cpm Muhamad Choirun, S.E., S.H., M.Hum., M.Han. Perwira Polisi Militer TNI AD. Karir: Danden POM I/1 Siantar (2019), Danpomdam XV/Pattimura (2025). Berpengalaman di bidang hukum militer dan penegakan disiplin TNI.',
  },
  {
    nama: 'Nur Indijah',
    jabatan: 'Anggota Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-74'
  },
  {
    nama: 'Suhadi',
    jabatan: 'Anggota Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-77'
  },
  {
    nama: 'Bin Nahadi',
    jabatan: 'Anggota Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-94'
  },
  {
    nama: 'Angga Kristanto',
    jabatan: 'Anggota Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-12'
  },
  {
    nama: 'Priscila Kusumaningrum',
    jabatan: 'Anggota Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-07'
  },
  {
    nama: 'Rusno Setyawan',
    jabatan: 'Anggota Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-05'
  },

  // Bendahara
  {
    nama: 'Arif Gunarto',
    jabatan: 'Bendahara Umum',
    kategori: 'pengurus-pusat',
    subkategori: 'Bendahara',
    angkatan: 'A-90'
  },
  {
    nama: 'Yoyok Hery Wahyono',
    jabatan: 'Bendahara I',
    kategori: 'pengurus-pusat',
    subkategori: 'Bendahara',
    angkatan: 'A-91',
    posisi: 'Pendiri & CEO Waroeng Spesial Sambal (SS)',
    ringkasan: 'Pengusaha kuliner nasional — pendiri Waroeng SS dengan ratusan cabang hingga ekspansi ke Malaysia. Menerapkan konsep spiritual company: sebagian omzet untuk santunan kelompok marginal.',
    foto: 'https://upload.wikimedia.org/wikipedia/id/.../Yoyok_Hery_Wahyono.jpg',
  },
  {
    nama: 'Riang Soedarsono',
    jabatan: 'Bendahara II',
    kategori: 'pengurus-pusat',
    subkategori: 'Bendahara',
    angkatan: 'A-80'
  },

  // Kaur K/B & Akuntansi/Pelaporan
  {
    nama: 'Purnomo Adi Nugroho',
    jabatan: 'Kaur K/B & Akuntansi/Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-82'
  },
  {
    nama: 'Ruly Astuti Hestiningrum',
    jabatan: 'Wakil Kaur K/B & Akuntansi/Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-95'
  },
  {
    nama: 'Diah Nur Haryanti',
    jabatan: 'Anggota Akuntansi & Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-84'
  },
  {
    nama: 'Danang Dwi Karnanto',
    jabatan: 'Anggota Akuntansi & Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-03',
    ringkasan: 'Leader Gerakan Sekolah Menyenangkan (GSM) Boyolali. Bekerja di Dinas Pendidikan dan Kebudayaan Kabupaten Boyolali. Aktif dalam transformasi pendidikan di Boyolali.',
  },
  {
    nama: 'Wijayanti',
    jabatan: 'Anggota Akuntansi & Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-03'
  },
  {
    nama: 'Agung Ari W',
    jabatan: 'Anggota Akuntansi & Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-00'
  },
  {
    nama: 'M. Zaki Mubarak',
    jabatan: 'Anggota Akuntansi & Pelaporan',
    kategori: 'pengurus-pusat',
    subkategori: 'Akuntansi & Pelaporan',
    angkatan: 'A-02'
  },

  // Kaur Pendanaan
  {
    nama: 'Suzana Endah Setyowati',
    jabatan: 'Kaur Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-82'
  },
  {
    nama: 'Nugroho Edy Nurno Atmojo',
    jabatan: 'Wakil Kaur Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-02'
  },
  {
    nama: 'Chris Ismastuti',
    jabatan: 'Anggota Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-76'
  },
  {
    nama: 'Eko Erna Rahmawati',
    jabatan: 'Anggota Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-85'
  },
  {
    nama: 'Wahyu Setyani',
    jabatan: 'Anggota Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-98'
  },
  {
    nama: 'Joko Purnomo',
    jabatan: 'Anggota Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-04'
  },
  {
    nama: 'Paryanta',
    jabatan: 'Anggota Pendanaan',
    kategori: 'pengurus-pusat',
    subkategori: 'Pendanaan',
    angkatan: 'A-87'
  },

  // Kaur Perencanaan dan Anggaran
  {
    nama: 'Suraji',
    jabatan: 'Kaur Perencanaan dan Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-91'
  },
  {
    nama: 'Sawitri Danik',
    jabatan: 'Wakil Kaur Perencanaan dan Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-89',
    ringkasan: 'Sawitri Danik Rahayuni, S.E., M.M. Karir ASN: Sekretaris DPUPR → Staf Ahli Bupati Bidang Ekonomi & Pembangunan → Kepala Dinas Koperasi dan Tenaga Kerja (Diskopnaker) Kabupaten Boyolali (2025).',
  },
  {
    nama: 'Wachid Aris Budiman',
    jabatan: 'Anggota Perencanaan & Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-87'
  },
  {
    nama: 'Dwi Suroso',
    jabatan: 'Anggota Perencanaan & Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-93'
  },
  {
    nama: 'Esti Widayanti',
    jabatan: 'Anggota Perencanaan & Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-95'
  },
  {
    nama: 'Sulistyo',
    jabatan: 'Anggota Perencanaan & Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-98'
  },
  {
    nama: 'Susanto',
    jabatan: 'Anggota Perencanaan & Anggaran',
    kategori: 'pengurus-pusat',
    subkategori: 'Perencanaan & Anggaran',
    angkatan: 'A-07'
  },

  // Bidang Kealmamateran
  {
    nama: 'Purwanto, S.H.',
    jabatan: 'Ketua Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-84'
  },
  {
    nama: 'Sugeng Tri Utamadi',
    jabatan: 'Wakil Ketua Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-85',
    ringkasan: 'Sugeng Tri Utamadi, S.Sn. Guru mata pelajaran Seni Budaya di SMAN 1 Boyolali. Terdaftar di platform e-learning sekolah.',
  },
  {
    nama: 'Kristiani',
    jabatan: 'Anggota Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-77'
  },
  {
    nama: 'Rustam Ardianto',
    jabatan: 'Anggota Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-94'
  },
  {
    nama: 'Nurul Nugroho',
    jabatan: 'Anggota Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-97'
  },
  {
    nama: 'Ari Wahyu Prabowo',
    jabatan: 'Anggota Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-00'
  },
  {
    nama: 'Muhammad Nur Arifin',
    jabatan: 'Anggota Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-13'
  },
  {
    nama: 'Sigit Budi Sulaksono',
    jabatan: 'Anggota Bidang Kealmamateran',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealmamateran',
    angkatan: 'A-92'
  },

  // Bidang Kealumnian
  {
    nama: 'Sukamti',
    jabatan: 'Ketua Bidang Kealumnian',
    kategori: 'pengurus-pusat',
    subkategori: 'Kealumnian',
    angkatan: 'A-82'
  }
]
