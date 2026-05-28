# UI/UX Wireframe — Koncolawas

## 1. Sitemap

```
KONCOLAWAS
│
├── 🔓 PUBLIC (tanpa login)
│   ├── Landing Page
│   └── Login (Google SSO redirect)
│
├── 👤 ALUMNI (setelah login Google)
│   ├── 📊 Dashboard
│   ├── 👤 Profil Saya
│   │   ├── Edit Profil
│   │   ├── Riwayat Pendidikan
│   │   └── Riwayat Pekerjaan
│   ├── 💬 Forum
│   │   ├── Daftar Kategori
│   │   ├── Daftar Thread
│   │   └── Detail Thread
│   ├── 👥 Grup Diskusi
│   │   ├── Daftar Grup
│   │   └── Ruang Chat Grup
│   ├── 💌 Chat Personal
│   ├── 💼 Lowongan Pekerjaan
│   │   ├── Daftar Lowongan
│   │   └── Detail Lowongan
│   ├── 🗺️ Peta Sebaran Alumni
│   └── 📈 Statistik Alumni
│
├── 🔧 ADMIN UNIT
│   ├── 📋 Dashboard Admin
│   ├── 👥 Data Alumni Unit
│   ├── 💬 Moderasi Forum
│   └── ✅ Approve Lowongan
│
└── ⚙️ SUPER ADMIN
    ├── 📊 Dashboard Super Admin
    ├── 👥 Semua Data Alumni
    ├── 📥 Import Buku Induk
    ├── 👤 Kelola Admin Unit
    ├── 💬 Kelola Forum & Kategori
    ├── ✅ Approve Lowongan (all)
    └── ⚙️ Pengaturan Sistem
```

---

## 2. Wireframe Layouts

### 2.1 Landing Page (Public)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Koncolawas                          [Masuk]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────────────────────────────┐               │
│   │                                      │               │
│   │   SILATURAHMI ALUMNI                 │               │
│   │   SMA N 1 BOYOLALI                   │               │
│   │                                      │               │
│   │   [Masuk dengan Google]              │               │
│   │                                      │               │
│   └──────────────────────────────────────┘               │
│                                                          │
│   Statistik Cepat:                                       │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│   │ 5000 │  │ 1200 │  │ 300  │  │ 45   │               │
│   │ Total│  │ Aktif│  │ Alumni│  │Kec.  │               │
│   │Alumni│  │ User │  │Bekerja│  │Asal  │               │
│   └──────┘  └──────┘  └──────┘  └──────┘               │
│                                                          │
│   [Footer: SMA N 1 Boyolali — Koncolawas]                │
└─────────────────────────────────────────────────────────┘
```

**Deskripsi:**
- Hero section dengan ajakan login via Google SSO
- Statistik publik sebagai social proof
- Minimalis, mobile-first

---

### 2.2 Dashboard Alumni (setelah login)

```
┌─────────────────────────────────────────────────────────┐
│ ☰ Koncolawas                    🔔 [Foto] 👤 Nama       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Selamat datang, [Nama]!                    Lengkapi →  │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 💬 Forum │ │ 👥 Grup  │ │ 💼 Kerja │ │ 🗺️ Peta │   │
│  │ 3 baru   │ │ 2 grup   │ │ 5 baru   │ │ Sebaran  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  ── Aktivitas Terbaru ──                                 │
│  • [Forum] Alumni angkatan 2005...        2 jam lalu     │
│  • [Lowongan] PT. Garuda...              5 jam lalu     │
│  • [Grup] Pesan baru di grup IPA...      1 hari lalu    │
│                                                          │
│  ── Alumni Lain yang Mungkin Dikenal ──                  │
│  [Foto] [Foto] [Foto] [Foto] [Foto] → Lihat Semua       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Navigasi Bawah (Mobile):**
```
[🏠 Beranda] [💬 Forum] [👥 Grup] [💼 Lowongan] [👤 Profil]
```

**Deskripsi:**
- Quick action cards ke fitur utama
- Feed aktivitas terbaru
- Rekomendasi alumni (berdasarkan angkatan/kelas yang sama)
- Bottom navigation untuk mobile

---

### 2.3 Edit Profil

```
┌─────────────────────────────────────────────────────────┐
← Edit Profil                                    [Simpan]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Foto Profil                                            │
│  ┌──────────┐                                           │
│  │  🖼️     │  [Ganti Foto]                              │
│  └──────────┘                                           │
│                                                          │
│  Data dari buku induk tersedia ✨                        │
│  [Nama Lengkap] ⚡ [Saran: Ahmad Fauzi (2005)] v       │
│  [No. HP]                 [Status] v                    │
│  [Tahun Masuk]            [Tahun Lulus]                 │
│  [Jurusan] v    [Kelas 3 (XII)]    [Kelas 2] [Kelas 1] │
│                                                          │
│  ── Alamat ──                                           │
│  [Kota Domisili]                                         │
│  [Kecamatan Asal Boyolali] v                             │
│  [Alamat Lengkap] (opsional)                             │
│                                                          │
│  ── Media Sosial ──                                     │
│  [LinkedIn URL]   [Instagram URL]                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Deskripsi:**
- Field Nama dilengkapi ikon ⚡ dan dropdown saran dari buku induk
- Autocomplete: saat mengetik, muncul saran dari buku induk
- Kecamatan Asal: dropdown daftar kecamatan Boyolali

---

### 2.4 Forum — Daftar Kategori

```
┌─────────────────────────────────────────────────────────┐
← Forum                                             [+ 💬] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ── Kategori Forum ──                                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📢 Pengumuman                          3 thread  │   │
│  │ Info resmi dari sekolah                   →      │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🎓 Angkatan 2000-2005                  12 thread │   │
│  │ Forum khusus angkatan 2000-2005             →    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 💼 Karir & Lowongan                      8 thread │   │
│  │ Diskusi seputar karir dan pekerjaan          →    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🎉 Obrolan Bebas                       45 thread │   │
│  │ Tempat ngobrol santai alumni                →    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 2.5 Detail Thread Forum

```
┌─────────────────────────────────────────────────────────┐
← Pengumuman                                       [+]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Reuni Akbar 2026                                        │
│  Diposting oleh Admin · 2 jam lalu                       │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─              │
│  Hai alumni semua!                                        │
│                                                          │
│  Akan diadakan Reuni Akbar SMA N 1 Boyolali...           │
│                                                          │
│  👍 12      💬 5 komentar                                │
│                                                          │
│  ── Komentar ──                                         │
│                                                          │
│  [Foto A] Ahmad    · 1 jam lalu                          │
│  Siap hadir! 🙌                                          │
│  👍 3      [Balas]                                        │
│                                                          │
│    [Foto B] Budi    · 30 menit lalu                      │
│    Sama! Ajak teman satu angkatan ya                │
│    [Balas]                                                │
│                                                          │
│  [Foto C] Citra    · 15 menit lalu                       │
│  Mohon info lokasinya dimana ya?                         │
│  👍 1      [Balas]                                        │
│                                                          │
│  ── Tulis komentar ──                                   │
│  ┌─────────────────────────────────────────────┐        │
│  │ Ketik komentar...                    [Kirim] │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 2.6 Grup Diskusi — Chat

```
┌─────────────────────────────────────────────────────────┐
← Grup Diskusi                                  [Info]    │
├─────────────────────────────────────────────────────────┤
│  📌 Grup: Angkatan 2005 — IPA 1 · 45 anggota            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │                         [Foto] Ahmad · 09:00 │        │
│  │                         Halo teman-teman!    │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │                         [Foto] Budi · 09:02  │        │
│  │                         Wah lama tak jumpa! │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌────────────────────────────────┐                      │
│  │ [Foto] Citra · 09:05          │                      │
│  │ Ada yang mau reuni?           │                      │
│  └────────────────────────────────┘                      │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │ [Foto] Deni · 09:10               Aku mau! 🙋│        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────┐  ┌───────────────────────┐             │
│  │ 📎           │  │ Ketik pesan...  [➤]   │             │
│  └──────────────┘  └───────────────────────┘             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 2.7 Lowongan Pekerjaan

```
┌─────────────────────────────────────────────────────────┐
← Lowongan Pekerjaan                              [Filter] │
├─────────────────────────────────────────────────────────┤
│  🔍 [Cari lowongan...]                                  │
│                                                          │
│  [Semua] [Full-time] [Part-time] [Internship]           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ PT. Teknologi Maju                               │   │
│  │ 💼 Software Engineer · Full-time                 │   │
│  │ 📍 Jakarta · 🕐 Deadline: 15 Juni 2026           │   │
│  │ Diposting oleh: Alumni 2010                      │   │
│  │                                          [Lihat] │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ SMA N 1 Boyolali                                 │   │
│  │ 💼 Staff TU · Full-time                          │   │
│  │ 📍 Boyolali · 🕐 Deadline: 20 Juni 2026          │   │
│  │ Diposting oleh: Admin Sekolah                    │   │
│  │                                          [Lihat] │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ PT. Sukses Selalu                                │   │
│  │ 💼 Digital Marketing · Part-time                 │   │
│  │ 📍 Remote · 🕐 Deadline: 30 Juni 2026            │   │
│  │ Diposting oleh: Alumni 2012                      │   │
│  │                                          [Lihat] │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Detail Lowongan:**
```
┌─────────────────────────────────────────────────────────┐
← Lowongan                                     [Bagikan]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PT. Teknologi Maju                                     │
│  Software Engineer                                      │
│  📍 Jakarta · 💼 Full-time                              │
│                                                          │
│  📝 Deskripsi:                                          │
│  Kami mencari Software Engineer berpengalaman...         │
│                                                          │
│  ✅ Kualifikasi:                                         │
│  • Minimal S1 Teknik Informatika                        │
│  • Pengalaman 2+ tahun                                  │
│  • Menguasai React, Node.js                             │
│                                                          │
│  📞 Kontak: hr@teknologimaju.com                        │
│  🕐 Deadline: 15 Juni 2026                              │
│                                                          │
│  [🌐 Lamar via Link Eksternal]                          │
│                                                          │
│  Diposting oleh: Alumni 2010 · 3 hari lalu              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 2.8 Peta Sebaran Alumni

```
┌─────────────────────────────────────────────────────────┐
← Peta Sebaran Alumni                                     │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐     │
│  │                                                │     │
│  │              🗺️ PETA INDONESIA                 │     │
│  │                                                │     │
│  │         ●●●        ● ●                         │     │
│  │      ●●  ● ●  ●●                               │     │
│  │    ●  ●   ●   ●                                │     │
│  │   ● DOMISILI ALUMNI     ●                      │     │
│  │    ● ●●  ●  ●  ●                              │     │
│  │       ●  ● ●   ●  ●                           │     │
│  │          ●    ●                               │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Filter: [Angkatan] [Kota] [Kec. Asal]                  │
│                                                          │
│  📊 Total: 1.234 alumni terdata                         │
│  🏙️  Top 5 Kota: Jakarta(234), Boyolali(189), ...      │
│  🏘️  Sebaran Kec. Asal: Mojosongo(89), ...             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 2.9 Dashboard Admin (Super Admin / Admin Unit)

```
┌─────────────────────────────────────────────────────────┐
│ ☰ Koncolawas — Admin                    [Foto] 🛡️      │
├─────────────────────────────────────────────────────────┤
│  ⬅️ Menu Samping                                              │
│  ┌────────────────┐                                      │
│  │ 📊 Dashboard   │  Selamat datang, Admin!              │
│  │ 👥 Data Alumni │                                      │
│  │ 📥 Import Data │  ┌────────┐ ┌────────┐              │
│  │ 💬 Forum       │  │ 5.000  │ │ 1.200  │              │
│  │ 💼 Lowongan    │  │ Total  │ │ Alumni │              │
│  │ 👤 Admin Unit  │  │Alumni  │ │ Aktif  │              │
│  │ ⚙️ Pengaturan  │  └────────┘ └────────┘              │
│  └────────────────┘  ┌────────┐ ┌────────┐              │
│                      │ 45     │ │ 12     │              │
│                      │Kec.    │ │Lowongan│              │
│                      │Asal    │ │Baru    │              │
│                      └────────┘ └────────┘              │
│                                                          │
│  ── Alumni Perlu Verifikasi (3) ──                      │
│  [Nama] [Angkatan] [Verifikasi] [Tolak]                 │
│  [Nama] [Angkatan] [Verifikasi] [Tolak]                 │
│                                                          │
│  ── Lowongan Perlu Approve (5) ──                       │
│  [Judul] [Posted by] [Approve] [Tolak]                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### 2.10 Data Alumni (Admin)

```
┌─────────────────────────────────────────────────────────┐
← Data Alumni                                    [+Tambah] │
├─────────────────────────────────────────────────────────┤
│  🔍 [Cari nama/NIS...]     [Filter] [Export]           │
│                                                          │
│  Angkatan: [Semua v]  Kelas 3: [Semua v]  Status: [..] │
│                                                          │
│  ┌───┬────────────┬──────┬──────┬─────────┬──────┐     │
│  │ # │ Nama       │ Thn  │ Kelas│ Domisili│Match│     │
│  ├───┼────────────┼──────┼──────┼─────────┼──────┤     │
│  │ 1 │ Ahmad      │ 2005 │ XII-1│ Jakarta │ ✅  │     │
│  │ 2 │ Budi       │ 2005 │ XII-1│ Boyolali│ ❌  │     │
│  │ 3 │ Citra      │ 2006 │ XII-2│ Surabaya│ ✅  │     │
│  │...│ ...        │ ...  │ ...  │ ...     │ ...  │     │
│  └───┴────────────┴──────┴──────┴─────────┴──────┘     │
│                                                          │
│  Menampilkan 1-10 dari 5.000              [1][2][3]...  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Komponen UI Umum

### 3.1 Bottom Navigation (Mobile)
```
[🏠 Beranda] [💬 Forum] [👥 Grup] [💼 Lowongan] [👤 Saya]
```

### 3.2 Sidebar Navigation (Desktop)
```
┌────────────────┐
│ [Logo]         │
├────────────────┤
│ 🏠 Beranda    │
│ 👤 Profil      │
│ 💬 Forum       │
│ 👥 Grup        │
│ 💌 Chat        │
│ 💼 Lowongan    │
│ 🗺️ Peta        │
│ 📈 Statistik   │
├────────────────┤
│ ⚙️ Pengaturan  │
│ 🚪 Keluar      │
└────────────────┘
```

### 3.3 Komponen Reusable
| Komponen | Fungsi |
|---|---|
| **Card Alumni** | Foto + Nama + Angkatan + Kelas 3 + Status |
| **Saran Buku Induk** | Dropdown dengan ikon ⚡ saat edit profil |
| **Badge Match** | ✅ (match buku induk) / ❌ (manual) di panel admin |
| **Filter Chips** | Filter horizontal untuk angkatan, kelas, jurusan |
| **Empty State** | Ilustrasi + "Belum ada data" + CTA |

---

## 4. Desain Prinsip

| Prinsip | Penerapan |
|---|---|
| **Mobile-first** | Bottom nav, full-width cards, touch targets ≥ 44px |
| **Sederhana & familiar** | UI mirip WhatsApp Groups + Forum (minimal learning curve) |
| **Frictionless** | Google SSO 1 klik, autocomplete dari buku induk |
| **Transparan** | Badge match buku induk, status verifikasi jelas |
| **Boyolali touch** | Warna/tema bisa mengadopsi identitas SMA N 1 Boyolali |

---

## 5. Alur Navigasi Utama

```
Landing Page
    │
    ▼ [Login Google]
Dashboard Alumni
    │
    ├──▶ [Profil] → Edit Profil → Riwayat Pendidikan/Pekerjaan
    │
    ├──▶ [Forum] → Kategori → Thread → Komentar
    │
    ├──▶ [Grup] → Daftar Grup → Chat Grup
    │            → Chat Personal
    │
    ├──▶ [Lowongan] → Daftar → Detail → Link Eksternal
    │
    ├──▶ [Peta] → Filter → Lihat Sebaran
    │
    └──▶ [Statistik] → Grafik & Angka
```

---

*Dokumen wireframe ini akan menjadi acuan untuk desain visual (UI mockup) menggunakan Figma atau tools desain lainnya.*
