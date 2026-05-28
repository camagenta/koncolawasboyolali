# PRD — Koncolawas
## Aplikasi Manajemen Alumni SMA N 1 Boyolali

| | |
|---|---|
| **Dokumen** | Product Requirements Document (PRD) |
| **Aplikasi** | Koncolawas |
| **Institusi** | SMA N 1 Boyolali |
| **Versi** | 1.0 |
| **Status** | Draft |

---

## 1. Visi & Tujuan

### Visi
Menjadi platform digital terpadu yang menghubungkan seluruh alumni SMA N 1 Boyolali, memfasilitasi silaturahmi, kolaborasi, serta tracking kontribusi dan perkembangan karir alumni.

### Tujuan
1. Mensentralisasi data alumni yang saat ini tersebar di berbagai media.
2. Memudahkan komunikasi dua arah antara sekolah dan alumni.
3. Memetakan sebaran dan perkembangan karir alumni.
4. Menyediakan wadah informasi lowongan pekerjaan bagi alumni.
5. Menjaga tali silaturahmi antar angkatan melalui forum diskusi.

---

## 2. Target Pengguna (User Roles)

### 2.1 Super Admin
- **Akses penuh** ke seluruh fitur dan data.
- Mengelola admin unit (tambah/hapus/ubah peran).
- Melihat seluruh data alumni tanpa batasan angkatan/unit.
- Melakukan konfigurasi sistem (pengaturan umum, logo, dll).

### 2.2 Admin Unit
- **Akses terbatas** sesuai unit yang ditugaskan (misal per angkatan).
- CRUD data alumni di unit masing-masing.
- Memoderasi forum diskusi unitnya.
- Mengelola lowongan pekerjaan yang masuk.

### 2.3 Alumni
- Login via **Google SSO** (tidak perlu registrasi manual).
- Melengkapi & memperbarui profil (biodata, karir, kontak).
- Data dari buku induk muncul sebagai **saran autocomplete** saat mengisi profil.
- Berpartisipasi di forum diskusi.
- Melihat & melamar lowongan pekerjaan.
- Melihat peta sebaran alumni.

> **Catatan:** Tamu (non-login) hanya bisa melihat halaman publik seperti info sekolah dan statistik umum.

---

## 3. Fitur MVP (Fase 1)

### 3.1 Manajemen Data Alumni
| | |
|---|---|
| **PIC** | Super Admin, Admin Unit |
| **Deskripsi** | Pusat data alumni yang terstruktur dan mudah dikelola. |

- **Login Google SSO**: Alumni masuk dengan akun Google — tidak perlu daftar manual.
- **CRUD Biodata**: Nama lengkap, tahun masuk, kontak, alamat, dll.
- **Autocomplete dari Buku Induk**: Saat alumni mengisi/edit profil, sistem menyarankan data dari buku induk (nama, tahun masuk) untuk memudahkan dan menjaga konsistensi data.
- **Pencarian & Filter**: Cari berdasarkan nama, tahun masuk, tahun lulus, kota.
- **Manajemen Unit**: Pengelompokan data berdasarkan angkatan, jurusan (IPA/IPS), atau kelas.
- **Riwayat Aktivitas**: Log perubahan data alumni.

### 3.2 Tracking Karir & Peta Sebaran
| | |
|---|---|
| **PIC** | Alumni (input), Super Admin & Admin Unit (monitor) |
| **Deskripsi** | Memetakan perkembangan karir dan lokasi alumni. |

- **Profil Karir Alumni**: Input riwayat pendidikan lanjutan, pekerjaan, jabatan, perusahaan.
- **Timeline Karir**: Riwayat kronologis karir tiap alumni.
- **Peta Sebaran**: Visualisasi peta interaktif (Indonesia) sebaran alumni berdasarkan kota/domisili.
- **Statistik & Grafik**: Dashboard statistik — jumlah alumni per tahun masuk, per jurusan, per sektor pekerjaan, per kota.
- **Export Laporan**: Laporan sebaran alumni dalam format PDF/Excel.

### 3.3 Forum / Diskusi Alumni
| | |
|---|---|
| **PIC** | Semua role (dengan pembatasan tertentu) |
| **Deskripsi** | Wadah diskusi alumni yang terstruktur per unit/topik, dilengkapi chat personal dan grup. |

- **Forum Thread**: Kategori per angkatan & per topik (karir, info, hiburan, dll). Buat, balas, dan like thread.
- **Chat Personal (1-on-1)**: Pesan langsung antar alumni real-time.
- **Grup Diskusi**: Grup per angkatan atau per topik mirip WhatsApp Group.
- **Moderasi**: Admin dapat edit/hapus postingan yang melanggar aturan.
- **Notifikasi**: Mention (@user), notifikasi balasan, dan notifikasi pesan baru.
- **Privasi**: Forum/grup tertentu bisa publik (semua alumni) atau private (angkatan tertentu).

### 3.4 Lowongan Pekerjaan
| | |
|---|---|
| **PIC** | Admin Unit (publish), Alumni (lihat & akses) |
| **Deskripsi** | Info lowongan pekerjaan dari dan untuk alumni. |

- **Posting Lowongan**: Alumni dan admin dapat mengirimkan info lowongan.
- **Approval**: Admin menyetujui/menolak lowongan sebelum tayang.
- **Filter & Kategori**: Berdasarkan bidang, lokasi, tipe (full-time, part-time, internship).
- **Detail Lowongan**: Deskripsi, kualifikasi, kontak, batas waktu.
- **Apply/Lamar**: Alumni dapat melamar melalui link eksternal atau menghubungi kontak yang tersedia (tanpa upload CV di sistem).

---

## 4. Fitur Fase 2 (Post-MVP)

| Fitur | Prioritas | Keterangan |
|---|---|---|
| Buku Tahunan Digital | Medium | Buku tahunan online per angkatan |
| Donasi / Infaq Alumni | Medium | Donasi online terintegrasi payment gateway |
| Direktori Usaha Alumni | Low | Profil usaha milik alumni |
| Agenda & Event | Medium | Jadwal reuni, gathering, dan acara sekolah |
| E-Sertifikat / Wisuda Digital | Low | Unduh sertifikat alumni & wisuda digital |
| Notifikasi Push & Email | High | Broadcast pengumuman ke seluruh alumni |

---

## 5. Spesifikasi Teknis (Tentatif)

### 5.1 Platform
- **Hybrid**: Web App (Responsive) + Mobile App (Android/iOS).
- Pendekatan: **Mobile-first design** untuk web, dikembangkan terlebih dahulu untuk MVP.

### 5.2 Bahasa
- **Multi-bahasa**: Bahasa Indonesia (default) + Bahasa Inggris.
- Mekanisme: i18n (internationalization) dengan file terjemahan terpisah.

### 5.3 Arsitektur (Saran)
| Layer | Teknologi |
|---|---|
| **Frontend Web** | React / Next.js — responsive, SPA/SSR |
| **Mobile** | React Native / Flutter — berbagi logika dengan web |
| **Backend** | Node.js (Express/NestJS) atau Laravel |
| **Database** | PostgreSQL (relasional & geospasial untuk peta) |
| **Storage** | S3 / MinIO / local storage (foto, dokumen) |
| **Autentikasi** | Google SSO (OAuth 2.0) sebagai satu-satunya metode login alumni; JWT untuk session |
| **Map** | Leaflet / Mapbox (peta sebaran) |
| **Realtime** | WebSocket (untuk forum & notifikasi) |

> Spesifikasi teknis masih dapat berubah sesuai kesepakatan tim develop.

---

---

## 6. Strategi Data & Migrasi

### 6.1 Data Awal dari Buku Induk
| | |
|---|---|
| **Sumber** | Google Sheets (NIS + Nama + Angkatan) |
| **Cakupan** | Semua tahun masuk sejak sekolah berdiri |
| **Cara** | Ekspor Google Sheets → CSV → Import ke database |

### 6.2 Konsep: Buku Induk sebagai Referensi, Bukan Syarat
Buku induk tidak digunakan untuk **memvalidasi atau membatasi** akses alumni. Sebaliknya, data ini berfungsi sebagai **asisten cerdas** yang membantu alumni mengisi profil dengan cepat dan akurat.

### 6.3 Alur Penggunaan Buku Induk
1. Tim admin mengimpor data buku induk (NIS + Nama + Tahun Masuk) ke sistem.
2. Data ini menjadi **master reference** yang tidak bisa diedit oleh alumni (hanya admin).
3. Alumni login via Google SSO → data Google (nama, email) masuk sebagai data dasar.
4. Saat mengisi profil, sistem menampilkan **saran autocomplete** yang dicocokkan dari buku induk:
   - Alumni mulai mengetik nama → sistem menyarankan nama dari buku induk + tahun masuknya.
   - Jika dipilih → nama dan tahun masuk terisi otomatis sesuai buku induk.
   - Jika tidak cocok → alumni bisa mengisi manual (tetap bisa, tanpa blokade).
5. Alumni juga bisa **mencari dan mengklaim** data dirinya dari buku induk langsung.

### 6.4 Manfaat Pendekatan Ini
- **Zero friction** — alumni tidak perlu hafal NIS, cukup Google login.
- **Data quality** — alumni yang memilih saran dari buku induk otomatis datanya akurat.
- **Coverage tinggi** — semua alumni bisa bergabung tanpa hambatan.
- **Control** — admin tetap bisa melacak mana data yang sudah match dengan buku induk dan mana yang belum.

### 6.5 Maintenance Data
- Update data alumni (perubahan kontak, karir) dilakukan oleh alumni sendiri.
- Admin dapat mengoreksi data jika ditemukan ketidaksesuaian.
- Proses impor dapat diulang jika ada data tahun masuk baru yang perlu ditambahkan.

---

## 7. Data Plan

### 7.1 Sumber Data

| Sumber | Data | Cara |
|---|---|---|
| Buku Induk (Google Sheets) | NIS, Nama, Angkatan, (opsional: Jurusan, Kelas 3) | Import CSV oleh admin |
| Google SSO | Nama, Email | Otomatis saat login |
| Input Alumni | Profil lengkap, karir, kontak | Diisi manual oleh alumni |
| Admin | Verifikasi, koreksi data | Manual oleh admin |

### 7.2 Field Data Alumni

#### Profil Dasar
| Field | Tipe | Sumber | Wajib | Catatan |
|---|---|---|---|---|
| NIS | String | Buku induk | Tidak | Referensi dari buku induk, tidak ditanyakan ke alumni |
| Nama Lengkap | String | Google SSO / Buku induk / Alumni | Ya | Autocomplete dari buku induk saat edit profil |
| Email | String | Google SSO | Ya | Otomatis dari Google, tidak bisa diubah |
| No. HP / WhatsApp | String | Alumni | Ya | Kontak utama untuk komunikasi |
| Tahun Masuk | Number | Buku induk / Alumni | Ya | Tahun pertama masuk SMA — data utama (dulu disebut angkatan) |
| Tahun Lulus | Number | Buku induk / Alumni | Ya | Tahun kelulusan — data utama, biasanya tahun masuk + 3 |
| Jurusan | Enum (IPA/IPS) | Buku induk / Alumni | Tidak | |
| Kelas 1 (X) | String | Alumni | Tidak | Rombel awal, opsional |
| Kelas 2 (XI) | String | Alumni | Tidak | Deteksi perpindahan |
| Kelas 3 (XII) | String | Alumni | Ya | **Prioritas** — grup final alumni |
| Kota Domisili | String | Alumni | Ya | Kota tempat tinggal saat ini — untuk peta sebaran |
| Kecamatan Asal (Boyolali) | String | Alumni | Ya | Kecamatan asal di Boyolali — minimal untuk data kedaerahan |
| Alamat Lengkap | Text | Alumni | Tidak | Alamat domisili saat ini (lengkap), opsional |
| Foto Profil | Image | Alumni | Tidak | Upload file |
| Link LinkedIn | URL | Alumni | Tidak | |
| Link Instagram | URL | Alumni | Tidak | |
| Status | Enum | Alumni | Ya | Bekerja / Kuliah / Wirausaha / Belum Bekerja / Lainnya |

#### Riwayat Pendidikan
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| Jenjang | Enum (D3/S1/S2/S3) | Tidak | |
| Universitas / Institusi | String | Tidak | |
| Jurusan | String | Tidak | |
| Tahun Masuk | Number | Tidak | |
| Tahun Lulus | Number | Tidak | |
| Status | Enum (Lulus/Sedang) | Tidak | |

#### Riwayat Pekerjaan
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| Perusahaan / Institusi | String | Tidak | |
| Jabatan / Posisi | String | Tidak | |
| Sektor / Industri | String | Tidak | Untuk filter lowongan relevan |
| Tahun Mulai | Number | Tidak | |
| Tahun Selesai | Number | Tidak | Kosongkan jika masih bekerja |
| Kota Penempatan | String | Tidak | |
| Status | Enum (Aktif/Selesai) | Tidak | |

---

## 8. Alur User (User Flow)

### 8.1 Registrasi Alumni (Google SSO + Autocomplete Buku Induk)
```
[Buku Induk (Google Sheets)] → [Export CSV] → [Import ke Sistem]
→ [Database: NIS + Nama + Angkatan — Data Referensi]

[Alumni] → [Buka Koncolawas] → [Login dengan Google SSO]
→ [Data Google: Nama & Email tersimpan] → [Lengkapi Profil]
    ├─ [Sistem Tawarkan Saran dari Buku Induk]
    │   ├─ Alumni Pilih Saran → Nama & Tahun Masuk Terisi Otomatis ✓
    │   └─ Alumni Isi Manual → Data Tersimpan, Tanpa Blokade
    └─ [Input Kontak, Foto, Karir, dll]
→ [Profil Tersimpan — Aktif]
```

### 8.2 Unggah Lowongan Pekerjaan
```
[Login Admin] → [Menu Lowongan] → [Buat Lowongan Baru]
→ [Isi Detail: judul, deskripsi, kualifikasi, deadline]
→ [Submit] → [Super Admin Review] → [Approve / Tolak]
→ [Tayang di Halaman Lowongan Publik]
```

---

## 9. Non-Functional Requirements

| Aspek | Requirement |
|---|---|
| **Keamanan** | Enkripsi password (bcrypt), proteksi XSS/CSRF, role-based access control (RBAC) |
| **Kinerja** | Waktu muat halaman < 3 detik, support hingga 10.000+ data alumni |
| **Ketersediaan** | Uptime 99% (production), maintenance window di luar jam sibuk |
| **Privasi** | Data alumni tidak dipublikasikan tanpa izin; sesuai UU Perlindungan Data Pribadi |
| **Backup** | Backup database otomatis setiap hari |

---

## 10. Metrik Kesuksesan (KPI)

| KPI | Target (6 bulan) |
|---|---|
| Jumlah alumni terdaftar | ≥ 60% dari total alumni |
| Profil lengkap (dengan data karir) | ≥ 40% dari alumni terdaftar |
| Pengguna aktif bulanan (forum) | ≥ 20% dari alumni terdaftar |
| Lowongan yang diposting | ≥ 10 lowongan/bulan |
| Kepuasan pengguna (survey) | Rating ≥ 4.0 / 5.0 |

---

## 11. Timeline (Estimasi)

| Fase | Durasi | Output |
|---|---|---|
| **Fase 1 (MVP)** | 3–4 bulan | Web App: Manajemen Data + Tracking Karir + Forum + Lowongan |
| **Fase 2** | 2–3 bulan post-MVP | Buku Tahunan, Donasi, Event, Notifikasi Push |
| **Mobile App** | 2 bulan setelah Web stabil | Aplikasi Android & iOS |

---

## 12. Dokumen Terkait (Akan Dibuat)

- [ ] Technical Specification Document
- [ ] UI/UX Design System & Wireframe
- [ ] Database Schema & ERD
- [ ] API Documentation
- [ ] User Manual & Admin Manual

---

*Dokumen ini adalah draf awal dan akan terus disempurnakan seiring diskusi.*

