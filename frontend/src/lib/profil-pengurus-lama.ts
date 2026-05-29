export interface ProfileLama {
  nama: string
  namaLengkap?: string
  jabatan: string
  kategori: 'dewan-pembina' | 'dewan-penasehat' | 'dewan-pakar' | 'pengurus-pusat'
  subkategori?: string
  angkatan: string
  posisi?: string
}

export const profilesLama: ProfileLama[] = [
  // ==================== DEWAN PEMBINA ====================
  {
    nama: 'Seno Kusumoarjo',
    jabatan: 'Ketua Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-79'
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
    angkatan: 'A-61'
  },
  {
    nama: 'Susilo Siswoutomo',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-69'
  },
  {
    nama: 'Sulaiman Arif Arianto',
    jabatan: 'Anggota Dewan Pembina',
    kategori: 'dewan-pembina',
    angkatan: 'A-76'
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
    angkatan: 'A-81'
  },

  // ==================== DEWAN PENASEHAT ====================
  {
    nama: 'Jenderal TNI (Purn) Mulyono',
    jabatan: 'Ketua Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-79',
    posisi: 'Panglima TNI (2015–2017)'
  },
  {
    nama: 'Mayjen TNI (Purn) Sumardi',
    jabatan: 'Wakil Ketua Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-79',
    posisi: 'Pangdam V/Brawijaya (2015–2016)'
  },
  {
    nama: 'Irjen Pol (Purn) Erwin Triwanto',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-80'
  },
  {
    nama: 'Mayjen TNI (Purn) Juwondo',
    jabatan: 'Anggota Dewan Penasehat',
    kategori: 'dewan-penasehat',
    angkatan: 'A-81'
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
    posisi: 'Mantan Deputi BPKP — Komisaris IFG'
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
    angkatan: 'A-76'
  },
  {
    nama: 'Ir. Susilo Hambeg Poromarto, M.Sc., Ph.D.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-80'
  },
  {
    nama: 'Dr. Ir. Jaka Pujiyono, M.S.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-82',
    posisi: 'Senior Partner di Deloitte Indonesia'
  },
  {
    nama: 'Prof. Dr. Ir. Suwarno, M.T.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-83'
  },
  {
    nama: 'Prof. Dr. Sudarmin, M.Si.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-85'
  },
  {
    nama: 'Dr. Subekti Nurmawati, M.Si.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-85'
  },
  {
    nama: 'Condro Wibowo, S.T.P., M.Sc., Ph.D.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-93'
  },
  {
    nama: 'Dr. Eng. Ir. Pringgo Widyo Laksono, S.T., M.Eng., IPM.',
    jabatan: 'Anggota Dewan Pakar',
    kategori: 'dewan-pakar',
    angkatan: 'A-98'
  },

  // ==================== PENGURUS PUSAT ====================
  // Pimpinan
  {
    nama: 'Sumarno',
    jabatan: 'Ketua Umum',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-90'
  },
  {
    nama: 'Wahyu Irawan',
    jabatan: 'Ketua Harian I',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-85'
  },
  {
    nama: 'Gatot B Hastowo',
    jabatan: 'Ketua Harian II',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-77'
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
    angkatan: 'A-90'
  },
  {
    nama: 'Dony Mahendra',
    jabatan: 'Sekretaris II',
    kategori: 'pengurus-pusat',
    subkategori: 'Pimpinan',
    angkatan: 'A-04'
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
    angkatan: 'A-95'
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
    angkatan: 'A-84'
  },
  {
    nama: 'Letkol Cpm M. Choirun, S.E., S.H., M.H.',
    jabatan: 'Wakil Kaur Humas',
    kategori: 'pengurus-pusat',
    subkategori: 'Humas',
    angkatan: 'A-91'
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
    angkatan: 'A-91'
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
    angkatan: 'A-03'
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
    angkatan: 'A-89'
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
    angkatan: 'A-85'
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
