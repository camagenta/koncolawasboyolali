const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, '..', 'scripts', 'gcp-service-account.json');
const SHEET_NAME = 'ALUMNI BERPRESTASI';

const findings = {
  "1": {
    nama: "Prof. Dra. Th. Dwi Suryaningrum, MS.",
    posisi: "Peneliti BRIN (Badan Riset dan Inovasi Nasional)",
    angkatan: "1974",
    gender: "Perempuan",
    ringkasan: "Prof. Dra. Th. Dwi Suryaningrum, MS. Lulusan tahun 1974. Pensiun dari BRIN bulan Februari 2026. Berdomisili di Jakarta Utara."
  },
  "2": {
    nama: "Prof. Dr. Ir. Bagus Sediadi Bandol Utomo, MAppSc.",
    posisi: "Peneliti BRIN (Badan Riset dan Inovasi Nasional)",
    angkatan: "1973",
    gender: "Laki-laki",
    ringkasan: "Prof. Dr. Ir. Bagus Sediadi Bandol Utomo, MAppSc. Lulusan tahun 1973. Pensiun dari BRIN bulan November 2025. Berdomisili di Tangerang, Banten."
  },
  "3": {
    nama: "Marsekal Muda TNI (Purn.) Gunaryadi, S.E., M.M., M.Sc.",
    posisi: "Ketua STP AVIASI Jakarta (2013-2015)",
    angkatan: "1971",
    gender: "Laki-laki",
    ringkasan: "Purnawirawan TNI AU sekaligus akademisi. Menjabat sebagai Ketua Sekolah Tinggi Penerbangan (STP) Aviasi Jakarta. Penulis buku akademis di bidang Keselamatan Penerbangan. Lulusan SMA Negeri 1 Boyolali tahun 1971."
  },
  "4": {
    nama: "Prof. Dr. H. Baedhowi, M.Si.",
    posisi: "Sekretaris Jenderal Kemendiknas (2003-2005)",
    angkatan: "1969",
    gender: "Laki-laki",
    ringkasan: "Lahir di Boyolali 28 Agustus 1949. Guru Besar FKIP UNS. Sekjen Kementerian Pendidikan Nasional (2003-2005). Dirjen PMPTK. Ketua Majelis Dikdasmen PP Muhammadiyah. Wafat 4 Juli 2021.",
    foto: "https://simpeg.uns.ac.id/file/get?path=foto/2016/09/8muvrk8Hsz4bWYRJFdifV3j4PRx8LW5I.jpeg",
    sumber: "UNS SIMPEG, detik.com, antaranews.com, Wikipedia"
  },
  "5": {
    nama: "Letjen TNI (Purn.) Gunaryadi",
    posisi: "Perwira Tinggi TNI AD",
    angkatan: "1971",
    gender: "Laki-laki",
    ringkasan: "Letnan Jenderal TNI (Purn.). Alumni SMAN 1 Boyolali angkatan 1971. Informasi lebih lanjut dapat diperoleh dari Bowo grup Surabaya."
  },
  "6": {
    nama: "Ir. Muhadi",
    posisi: "Sekretaris Daerah Provinsi Banten",
    angkatan: "1973",
    gender: "Laki-laki",
    ringkasan: "Lahir di Boyolali tahun 1954. Lulusan Teknik Geodesi ITB (1981). Menjabat Sekda Provinsi Banten (2008-2014). Alumni SMAN 1 Boyolali angkatan 1973.",
    sumber: "Pikiran Rakyat, Wikipedia, Kompas.com"
  },
  "7": {
    nama: "Ir. Djoko Kirmanto, Dipl. HE.",
    posisi: "Menteri Pekerjaan Umum RI (2004-2014)",
    angkatan: "1961",
    gender: "Laki-laki",
    ringkasan: "Menteri Pekerjaan Umum RI selama dua kabinet (2004-2009, 2009-2014). Alumni SMAN 1 Boyolali. Lulusan Teknik Sipil UGM.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Djoko_Kirmanto_Official_Portrait.jpg",
    sumber: "Wikipedia, Viva.co.id"
  },
  "8": {
    nama: "Dr. KRHT Jupri Bandang Prawirodigdoyo Kusumanagoro, AK, M.M.",
    posisi: "Direktur Ditjen Pajak / Staff Ahli Kejaksaan Agung",
    angkatan: "1968",
    gender: "Laki-laki",
    ringkasan: "Pejabat di Ditjen Pajak (Kakanwil, Direktur Penyuluhan Perpajakan). Staff Ahli Kejaksaan Agung. Meraih gelar Doktor ke-2 di bidang Filsafat UIN Semarang. Alumni SMAN 1 Boyolali."
  },
  "9": {
    nama: "Susilo Siswoutomo",
    posisi: "Wakil Menteri ESDM (2013-2014)",
    angkatan: "1969",
    gender: "Laki-laki",
    ringkasan: "Lahir di Boyolali, 4 September 1950. Wakil Menteri ESDM Kabinet Indonesia Bersatu II. Karir 33 tahun di ExxonMobil sebagai Vice President. Alumni SMAN 1 Boyolali.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Susilo_Siswoutomo_Official.jpg",
    sumber: "Wikipedia"
  },
  "10": {
    nama: "Jenderal TNI (Purn.) Mulyono",
    posisi: "Kepala Staf Angkatan Darat (KASAD)",
    angkatan: "1979",
    gender: "Laki-laki",
    ringkasan: "Jenderal TNI (Purn.). Kepala Staf Angkatan Darat. Lulusan AKABRI/Akmil 1983. Alumni SMAN 1 Boyolali.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kasad_Mulyono.jpg",
    sumber: "Okezone, Sindonews, Viva.co.id"
  },
  "11": {
    nama: "Mayjen TNI (Purn.) Sumardi",
    posisi: "Dankodiklat TNI AD / Pangdam V/Brawijaya",
    angkatan: "1979",
    gender: "Laki-laki",
    ringkasan: "Mayjen TNI (Purn.). Lahir Boyolali 20 Feb 1959. Akmil 1984. Pangdam V/Brawijaya, Dankodiklat TNI AD. Mantan Ketum Bravo 5. Alumni SMAN 1 Boyolali.",
    foto: "https://thumb.viva.co.id/media/frontend/thumbs3/2022/06/06/629dc5a6da50a-letjen-tni-purn-sumardi_1265_711.jpeg",
    sumber: "Viva.co.id, kodiklat-tni.mil.id"
  },
  "12": {
    nama: "Irjen Pol. (Purn.) Drs. Erwin Triwanto, S.H.",
    posisi: "Kapolda (DIY, Kalsel, Kalbar)",
    angkatan: "1980",
    gender: "Laki-laki",
    ringkasan: "Lulusan Akpol 1986. Kapolda DIY (2015-2016), Kapolda Kalsel (2016-2017), Kapolda Kalbar (2017). Alumni SMAN 1 Boyolali.",
    foto: "https://img.antarafoto.com/cache/1200x800/2015/03/17/sertijab-kapolda-diy-afpm-dom.jpg",
    sumber: "ANTARA Foto, Wikipedia, Tribunnews"
  },
  "13": {
    nama: "Brigjen TNI Hari Prabowo",
    posisi: "Perwira Tinggi TNI AD",
    angkatan: "1979",
    gender: "Laki-laki",
    ringkasan: "Brigadir Jenderal TNI. Alumni SMAN 1 Boyolali angkatan 1979."
  },
  "14": {
    nama: "Mayjen TNI (Purn.) dr. Heru Pranata",
    posisi: "Kapoksahli RSPAD Gatot Soebroto",
    angkatan: "1982",
    gender: "Laki-laki",
    ringkasan: "Mayjen TNI (Purn.) dari kecabangan Kesehatan (CKM). Ketua Kelompok Staf Ahli RSPAD Gatot Soebroto. Alumni SMAN 1 Boyolali.",
    sumber: "Wikipedia, TNI AD"
  },
  "15": {
    nama: "Pardiman",
    posisi: "Direktur PT Petrokimia",
    angkatan: "1980",
    gender: "Laki-laki",
    ringkasan: "Direktur di PT Petrokimia. Alumni SMAN 1 Boyolali angkatan 1980."
  },
  "16": {
    nama: "Sumarno",
    posisi: "Sekretaris Daerah Provinsi Jawa Tengah",
    angkatan: "1990",
    gender: "Laki-laki",
    ringkasan: "Sekda Provinsi Jawa Tengah. Ketua IKABI (Ikatan Alumni SMP-SMA 1 Boyolali) periode 2022-2025. Alumni SMAN 1 Boyolali.",
    foto: "https://setda.jatengprov.go.id/uploads/1/2025-02/pak_sekda.jpg",
    sumber: "Pojokjateng.com, RRI, Setda Jateng"
  },
  "17": {
    nama: "Seno Samodro",
    posisi: "Bupati Boyolali",
    angkatan: "1983",
    gender: "Laki-laki",
    ringkasan: "Bupati Boyolali. Lulusan Sastra Prancis UGM. Alumni SMAN 1 Boyolali lulus tahun 1983.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Seno_Samodro.jpg",
    sumber: "Wikipedia, Boyolali.go.id"
  },
  "18": {
    nama: "Wahyu Irawan",
    posisi: "Wakil Bupati Boyolali",
    angkatan: "1985",
    gender: "Laki-laki",
    ringkasan: "Wakil Bupati Boyolali. Alumni SMAN 1 Boyolali angkatan 1985. Berprofesi sebagai pengusaha, Dirut Perumda Tirta Ampera Boyolali.",
    foto: "https://halosemarang.id/wp-content/uploads/2025/02/OK-10-Wabup-Iwan-Terima-Kunjungan-Kerja-Komisi-A-DPRD-Provinsi-Jawa-Tengah-Bahas-Penanggulangan-Kemiskinan.jpeg",
    sumber: "halosemarang.id (foto: boyolali.go.id)"
  },
  "19": {
    nama: "Masruri",
    posisi: "Sekretaris Daerah Kabupaten Boyolali",
    angkatan: "1983",
    gender: "Laki-laki",
    ringkasan: "Sekda Kabupaten Boyolali. Alumni SMAN 1 Boyolali angkatan 1983. Plh Bupati Boyolali (2021).",
    foto: "https://cdn.antaranews.com/cache/1200x800/2019/05/28/masruri-2.jpg",
    sumber: "ANTARA News (foto: Bambang Dwi Marwoto)"
  },
  "20": {
    nama: "Gatot Hermawan",
    posisi: "Deputi BP2MI",
    angkatan: "1985",
    gender: "Laki-laki",
    ringkasan: "Deputi Bidang Penempatan dan Pelindungan di BP2MI. Alumni SMAN 1 Boyolali angkatan 1985.",
    sumber: "BP2MI"
  },
  "21": {
    nama: "Hasto Wibowo",
    posisi: "Senior Vice President/SVP Integrated Supply Chain Pertamina / Direktur Pertamina Patra Niaga",
    angkatan: "1985",
    gender: "Laki-laki",
    ringkasan: "Executive di Pertamina Group. SVP Integrated Supply Chain (2018). Direktur Pemasaran Pusat dan Niaga Pertamina Patra Niaga (2020-2021). Alumni SMAN 1 Boyolali.",
    foto: "https://img.antarafoto.com/cache/1200x798/2026/05/12/sidang-putusan-korupsi-tata-kelola-minyak-mentah-1nrlx-dom.jpg",
    sumber: "ANTARA Foto, Katadata"
  },
  "22": {
    nama: "Edi Budoyo",
    posisi: "Wakil Bupati Manokwari",
    angkatan: "1976",
    gender: "Laki-laki",
    ringkasan: "Wakil Bupati Manokwari. Alumni SMAN 1 Boyolali angkatan 1976."
  },
  "23": {
    nama: "Ir. Muhadi",
    posisi: "Sekretaris Daerah Provinsi Banten",
    angkatan: "1973",
    gender: "Laki-laki",
    ringkasan: "Lahir di Boyolali 1954. Lulusan Teknik Geodesi ITB (1981). Sekda Banten (2008-2014). Alumni SMAN 1 Boyolali."
  },
  "24": {
    nama: "Dr. Ir. Joko Sarjadi",
    posisi: "Dosen/Akademisi (Teknik Mesin)",
    angkatan: "1976",
    gender: "Laki-laki",
    ringkasan: "Dr. Ir. Joko Sarjadi, jurusan Teknik Mesin. Alumni SMAN 1 Boyolali tahun 1976. Dosen di FTMD ITB. PhD dari TU Delft.",
    foto: "https://ftmd.itb.ac.id/wp-content/uploads/sites/385/2020/02/Pak-Djoko-Sarjadi.jpg",
    sumber: "ITB FTMD Staff Page"
  },
  "25": {
    nama: "Dr. Drs. Sutrisno",
    posisi: "Dosen/Akademisi (Fisika)",
    angkatan: "1976",
    gender: "Laki-laki",
    ringkasan: "Dr. Drs. Sutrisno, jurusan Fisika. Alumni SMAN 1 Boyolali tahun 1976."
  },
  "26": {
    nama: "Dr. Drs. Hendro (Sing sing)",
    posisi: "Dosen/Akademisi (Fisika)",
    angkatan: "1976",
    gender: "Laki-laki",
    ringkasan: "Dr. Drs. Hendro, jurusan Fisika. Alumni SMAN 1 Boyolali tahun 1976."
  },
  "27": {
    nama: "Prof. Dr. Suryotisnanto, S.H., M.H.",
    posisi: "Guru Besar/Akademisi Hukum",
    angkatan: "1980",
    gender: "Laki-laki",
    ringkasan: "Prof. Dr. Suryotisnanto, S.H., M.H. Alumni SMAN 1 Boyolali tahun 1980. Nama benar: Dr. Hieronymus Soerjatisnanta (HS Tisnanta). Guru Besar Hukum Universitas Lampung, dikukuhkan 31 Desember 2024. Lahir Boyolali 30 September 1961.",
    foto: "https://mih.fh.unila.ac.id/wp-content/uploads/2021/05/Dr.-HS.-Tisnanta-S.H.M.H.-1.png",
    sumber: "Unila Magister Hukum"
  },
  "28": {
    nama: "Dr. KRT. Jupri Bandang Prawirodigdoyo Kusumanagoro, A.K., M.M.",
    posisi: "Staff Ahli Kejaksaan Agung RI",
    angkatan: "1970",
    gender: "Laki-laki",
    ringkasan: "Berkiprah di Ditjen Pajak (Kanwil pajak) kemudian Staf Ahli Kejaksaan Agung. Meraih Doktor ke-2 Filsafat UIN Semarang. Asal Kudu, Kragilan, Mojosongo."
  },
  "29": {
    nama: "Tastaftiyan Risfandy, S.E., M.Sc., Ph.D.",
    posisi: "Wakil Dekan FEB Universitas Sebelas Maret (UNS)",
    angkatan: "2005",
    gender: "Laki-laki",
    ringkasan: "Wakil Dekan Bidang Kemahasiswaan dan Alumni FEB UNS. S1 UNS, S2 UGM, Master Limoges France, PhD Limoges France. Alumni SMAN 1 Boyolali 2005.",
    foto: "https://feb.uns.ac.id/feb/wp-content/uploads/2021/10/tastaftiyannn.jpg",
    sumber: "UNS.ac.id"
  },
  "30": {
    nama: "Prof. Dr. Mahmudah Enny Widyaningrum, Dra., Ec., M.Si.",
    posisi: "Dosen Universitas Bhayangkara",
    angkatan: "1975",
    gender: "Perempuan",
    ringkasan: "Prof. Dr. Mahmudah Enny Widyaningrum. Universitas Bhayangkara. Lulusan tahun 1975. Putri dari Pak Dirdjo (Guru Biologi)."
  },
  "31": {
    nama: "Ir. Tito Yuwono, S.T., M.Sc., Ph.D., IPM.",
    posisi: "Dosen Teknik Elektro UII",
    angkatan: "1995",
    gender: "Laki-laki",
    ringkasan: "Ir. Tito Yuwono, S.T., M.Sc., Ph.D., IPM. Lulusan SMAN 1 Boyolali tahun 1995. Dosen Teknik Elektro Universitas Islam Indonesia (UII). Berdomisili di Yogyakarta.",
    foto: "https://ee.uii.ac.id/wp-content/uploads/2022/11/Tito-Yuwono-S.T.-M.Sc_..jpg",
    sumber: "UII.ac.id"
  },
  "32": {
    nama: "Dr. Ir. Dwiningtyas Padmaningrum, S.P., M.Si.",
    posisi: "Dosen/Lektor Senior Universitas Sebelas Maret (UNS)",
    angkatan: "1990",
    gender: "Perempuan",
    ringkasan: "Akademisi, peneliti, dan dosen senior di UNS. Spesialis Penyuluhan Pertanian dan Komunikasi Pembangunan. Alumni 1990. Putri Alm. Pak Basuki (Guru Biologi)."
  },
  "33": {
    nama: "Dr. Subekti Nurmawati, M.Si.",
    posisi: "Dekan Fakultas Sains dan Teknologi Universitas Terbuka (2025-2030)",
    angkatan: "1985",
    gender: "Perempuan",
    ringkasan: "Dekan FST Universitas Terbuka (UT) periode 2025-2030. Alumni SMAN 1 Boyolali.",
    foto: "https://fst.ut.ac.id/wp-content/uploads/2022/04/FOTO-NURMAWATI-scaled-e1650349232583.jpg",
    sumber: "UT.ac.id, FST UT"
  },
  "34": {
    nama: "Dr. Ibnu Wahyudi, M.A.",
    posisi: "Dosen Sastra Indonesia, Fakultas Ilmu Pengetahuan Budaya UI",
    angkatan: "1976",
    gender: "Laki-laki",
    ringkasan: "Lahir di Boyolali, 24 Juni 1958. Sastrawan dan akademisi FIB UI. Murid Sapardi Djoko Damono. Master dari Monash University Australia. Alumni SMAN 1 Boyolali 1976.",
    foto: "https://www.tagar.id/Asset/uploads2019/1615717393162-ibnu-wahyudi.jpg",
    sumber: "Wikipedia, Espos.id, Tagar.id"
  },
  "35": {
    nama: "Dr. Joko Suryana",
    posisi: "Dosen/Peneliti STEI Institut Teknologi Bandung (ITB)",
    angkatan: "1990",
    gender: "Laki-laki",
    ringkasan: "Dosen dan peneliti senior di STEI ITB. Keahlian: telekomunikasi radio, sistem microwave dan satelit, sistem radar. Alumni SMAN 1 Boyolali 1990.",
    foto: "https://stei.itb.ac.id/wp-content/uploads/Joko-S.png",
    sumber: "STEI ITB Staff Page"
  },
  "36": {
    nama: "Dr. Solichatun, S.Si., M.Si.",
    posisi: "Kepala Program Studi Biologi FMIPA UNS",
    angkatan: "1989",
    gender: "Perempuan",
    ringkasan: "Dosen pengajar dan peneliti di Program Studi Biologi FMIPA UNS. Kaprodi Biologi UNS. Alumni SMAN 1 Boyolali 1989."
  },
  "37": {
    nama: "Prof. Dr. Eng. Kuwat Triyana, M.Si.",
    posisi: "Dekan FMIPA Universitas Gadjah Mada (UGM)",
    angkatan: "1986",
    gender: "Laki-laki",
    ringkasan: "Guru Besar Departemen Fisika FMIPA UGM. Dekan FMIPA UGM. Penemu GeNose (detektor COVID-19). Alumni SMAN 1 Boyolali.",
    foto: "https://files.simaster.ugm.ac.id/get/acdstf.php?param=dTB6RWMyTkJJd2ljMklWLzZIejhjRmhod1JaSTkrVkdLM2dEL1ZUSi8yM2tYNG1USGsyd0NWS0F4alFIU1JWbXVQZVJyd0ZQS3IzdnprOVFQRjNsbkE9PQ==",
    sumber: "UGM Academic Staff (acadstaff.ugm.ac.id)"
  },
  "38": {
    nama: "Sutopo Purwo Nugroho (Almarhum)",
    posisi: "Kepala Pusat Data, Informasi dan Humas BNPB (2017-2019)",
    angkatan: "1989",
    gender: "Laki-laki",
    ringkasan: "Kepala Pusdatin BNPB. Wafat 2019. Alumni SMAN 1 Boyolali. Dikenal sebagai juru bicara BNPB saat bencana alam.",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Sutopo_Purwo_Nugroho%2C_2018.jpg",
    sumber: "Wikipedia, BNPB"
  },
  "39": {
    nama: "Dr. Ir. Mufti Reza Aulia Putra, S.T., M.T., IPP.",
    posisi: "Dosen Teknik Elektro UNS",
    angkatan: "2013",
    gender: "Laki-laki",
    ringkasan: "Dr. Ir. Mufti Reza Aulia Putra, S.T., M.T., IPP. Lulus SMA 2013, lulus S1 2015. Dosen Teknik Elektro Universitas Sebelas Maret (UNS). Alumni SMAN 1 Boyolali. Lulusan termuda dan tercepat Program Doktor UNS (usia 25 tahun, IPK 4.00).",
    foto: "https://uns.ac.id/id/wp-content/uploads/2023/04/Dr.-Mufti-Reza-Aulia-Putra-S.T.-M.T.-Raih-IPK-4-Menjadi-Lulusan-Termuda-dan-Tercepat-Program-Doktor-UNS.jpg",
    sumber: "uns.ac.id"
  },
  "40": {
    nama: "Dr. Rini Tesniwati, S.E., M.M., M.Si., MMSI.",
    posisi: "Dosen Akuntansi Universitas Gunadarma",
    angkatan: "1989",
    gender: "Perempuan",
    ringkasan: "Dosen tetap di Jurusan Akuntansi Fakultas Ekonomi Universitas Gunadarma. Alumni SMAN 1 Boyolali 1989.",
    sumber: "Gunadarma.ac.id"
  },
  "41": {
    nama: "Prof. Dr. Dwi Prasetyani, S.E., M.Si., CIPE., CPRM.",
    posisi: "Direktur Direktorat Alumni dan Kewirausahaan Mahasiswa UNS",
    angkatan: "1995",
    gender: "Perempuan",
    ringkasan: "Guru Besar bidang Kewirausahaan dan Pemberdayaan Perempuan UNS (dikukuhkan Feb 2026). Direktur DAKM UNS. Alumni SMAN 1 Boyolali.",
    foto: "https://feb.uns.ac.id/feb/wp-content/uploads/2023/05/WhatsApp-Image-2023-05-16-at-08.20.11-e1685346466520.jpg",
    sumber: "FEB UNS Staff Profile"
  },
  "42": {
    nama: "Dr. Agus Andi Subroto, S.T.P., M.M.",
    posisi: "Dekan FHB ITB Yadika Pasuruan",
    angkatan: "1995",
    gender: "Laki-laki",
    ringkasan: "Dekan FHB ITB Yadika Pasuruan. Lulusan SMAN 1 Boyolali tahun 1995. Berdomisili di Surabaya.",
    foto: "https://itbyadika.ac.id/wp-content/uploads/2023/09/Agus-Andi-S-MM-e1694178990103-810x810.jpg",
    sumber: "ITB Yadika"
  },
  "43": {
    nama: "Prof. Suyitno",
    posisi: "Pensiunan Kementerian Pertanian",
    angkatan: "1972",
    gender: "Laki-laki",
    ringkasan: "Prof. Suyitno, lulusan SMAN 1 Boyolali tahun 1972. Alamat: Desa Lanjaran, Kecamatan Tamansari. Sudah pensiun."
  },
  "44": {
    nama: "Prof. Dr. Eng. Ir. Pringgo Widyo Laksono, S.T., M.Eng., IPU., ASEAN Eng.",
    posisi: "Guru Besar FT UNS / Kepala Program Profesi Insinyur UNS",
    angkatan: "1995",
    gender: "Laki-laki",
    ringkasan: "Guru Besar bidang Rekayasa Sistem Cerdas dan Otomasi FT UNS. Kepala Program Profesi Insinyur UNS. PhD dari Gifu University Jepang. Alumni SMAN 1 Boyolali. Asli Dk. Sumberejo, Kiringan, Boyolali.",
    foto: "https://simpeg.uns.ac.id/file/get?path=foto/2024/10/2455-mkkXgyUnOCzRLO5ts00gnOuq-VRBfHi0.png",
    sumber: "UNS SIMPEG, UNS.ac.id"
  },
  "45": {
    nama: "Prof. Suyamto (Almarhum)",
    posisi: "Pensiunan Kementerian Pertanian",
    angkatan: "1972",
    gender: "Laki-laki",
    ringkasan: "Prof. Suyamto (Almarhum). Pensiunan Kementan Jakarta. Seangkatan dengan Prof. Suyitno. Asli Kragilan. Beralamat di Apotik Merbabu, Jl. Merbabu."
  },
  "46": {
    nama: "Prof. Condro Wibowo, S.TP., M.Sc., Ph.D.",
    posisi: "Dosen Teknologi Pangan Universitas Jenderal Soedirman (UNSOED)",
    angkatan: "1993",
    gender: "Laki-laki",
    ringkasan: "Dosen di Program Studi Teknologi Pangan UNSOED. S1 UGM, S2 Georg-August University Gottingen Jerman, S3 Georg-August University Gottingen. Alumni SMAN 1 Boyolali 1993.",
    foto: "https://staff.unsoed.ac.id/preview/1136.jpg",
    sumber: "UNSOED.ac.id"
  },
  "47": {
    nama: "Prof. Suyitno",
    posisi: "Pensiunan",
    angkatan: "1972",
    gender: "Laki-laki",
    ringkasan: "Prof. Suyitno, Lulus 1972. Berasal dari Lanjaran, Musuk. Asli dari Kragilan."
  },
  "48": {
    nama: "Prof. Ir. Bambang Sudaryanto, MS.",
    posisi: "Pensiunan Kementerian Pertanian",
    angkatan: "1973",
    gender: "Laki-laki",
    ringkasan: "Prof. Ir. Bambang Sudaryanto, MS. Pensiunan Kementan Jakarta. Alamat: Jl. Merdeka Barat No. 7, Siswodipuran, Boyolali. Lulus SMA 1 Boyolali 1973."
  },
  "49": {
    nama: "Prof. Dr. Endang Wirjatmi Trilestari, M.Si.",
    posisi: "Deputi LAN RI / Guru Besar Politeknik STIA LAN Bandung",
    angkatan: "1970",
    gender: "Perempuan",
    ringkasan: "Lahir di Boyolali 14 Oktober 1954. Guru Besar Politeknik STIA LAN Bandung. Deputi Bidang Pembinaan Diklat Aparatur LAN RI (2009-2013). Lulus SMP 1 Boyolali 1970.",
    sumber: "STIA LAN Bandung"
  }
};

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Read existing data
  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAME}'!A:X`,
  });
  
  const header = r.data.values[0];
  const rows = r.data.values.slice(1);
  
  // Update rows with findings
  const updatedRows = rows.map((row) => {
    const no = row[0];
    const f = findings[no];
    if (f) {
      // Col 4 (Nama Lengkap - index 4)
      if (f.nama) row[4] = f.nama;
      // Col 8 (Posisi / Jabatan Terakhir - index 8)
      if (f.posisi) row[8] = f.posisi;
      // Col 6 (Angkatan - index 6) - keep if exists
      if (!row[6] && f.angkatan) row[6] = f.angkatan;
      // Col 7 (Tahun Lulus - index 7)
      if (!row[7] && f.angkatan) row[7] = f.angkatan;
      // Col 9 (Ringkasan - index 9)
      if (f.ringkasan) row[9] = f.ringkasan;
      // Col 10 (URL Foto - index 10)
      if (f.foto) row[10] = f.foto;
      // Col 11 (Gender - index 11)
      if (f.gender) row[11] = f.gender;
      // Col 12 (Sumber - index 12)
      if (f.sumber) row[12] = f.sumber;
      else if (!row[12]) row[12] = 'Issue #45 GitHub';
      // Col 18 (Status OSINT - index 18)
      row[18] = 'DONE';
      // Col 19 (PIC - index 19)
      row[19] = 'Sisyphus AI';
      // Col 20 (Tgl Riset - index 20)
      row[20] = '2026-05-31';
      // Col 21 (Prioritas - index 21)
      row[21] = 'P1';
    }
    return row;
  });

  // Write back to sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAME}'!A1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [header, ...updatedRows]
    }
  });
  
  const done = Object.keys(findings).length;
  const total = updatedRows.length;
  console.log(`Updated ${done}/${total} entries with OSINT findings pushed to sheet ${SHEET_NAME}!`);
}

main().catch(console.error);
