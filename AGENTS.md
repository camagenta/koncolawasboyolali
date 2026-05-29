# AGENTS.md — Koncolawas

## Session 2026-05-28

### Features Added

### Onboarding Flow
- **App shell** (`app-shell.tsx`): After auth confirmed, fetches `GET /alumni/profiles/me`. If 404 (no profile) or `tahunMasuk`/`tahunLulus` empty, redirects to `/profile`. Skips check when already on `/profile` to prevent infinite loop. Shows loading spinner during check.
- **Profile page** (`profile/page.tsx`): Handles 404 from profile fetch gracefully (no error toast for new users). Yellow onboarding banner "Lengkapi data tahun masuk dan tahun lulus untuk mengakses fitur lainnya" shown when fields are empty. `tahunMasuk` and `tahunLulus` marked as required with red asterisk.
- No backend changes needed — existing `GET /alumni/profiles/me` endpoint returns `tahunMasuk`/`tahunLulus` and throws 404 when no profile exists.

### Bugs Fixed
- Login blank page: Google Strategy email fallback when `emails` array is missing
- 502 auth proxy: Added `_next/data` rewrite exclusion to prevent double-handling
- Stats overview: Use `req.query` instead of `req.body` for GET route params

### Features Added
- **Kelas tracking**: `kelas1`, `kelas2`, `kelas3` fields on `Alumni` model; bulk-update endpoint; CSV import auto-detects kelas columns
- **Alumni cards**: `kelas3` displayed; `kelas1`/`kelas2` shown when different from kelas3
- **Alumni Berprestasi**: `isAchiever` flag toggle; carousel on homepage

### Backend
- Google Strategy email fallback using `profile._json.email`
- `ImportController` with `fromSheet` and `fromLegacy` endpoints
- `SuccessStory` Prisma model + CRUD controller (CRUDController)
- `GET /api/whoami` returns full user + alumni profile

### Frontend
- `/sukses` page with grid of success stories + detail modal with "Lihat Profil Lengkap" link
- `/admin/success-stories` CRUD with form modal
- Admin sidebar nav items + sub-nav for success stories
- Migration button on `/admin/import` page (POST to `/import/from-legacy`)

### Docs & GitHub
- README rewrite with updated setup instructions
- Issue #35 document: Import from Old Platform & Google Sheets
- Issue #36 document: Success Stories feature
- Issue #30 closed (success stories)
- Migration ready: 67 alumni with emails from koncolawas2005.web.app
- Sync penuh: semua kode terdokumentasi di GitHub sebagai rujukan utama

---

## Workflow Siklus Development

Setiap siklus perubahan WAJIB mengikuti 5 langkah berikut:

1. **Plan** — analisis kebutuhan, buat todo list, bagi tugas ke agent paralel
2. **Delegate** — dispatch agent untuk setiap task independen
3. **Build** — `npx next build` (frontend) + `npx nest build` (backend) — pastikan kompilasi sukses
4. **Deploy** — `pm2 restart koncolawas-api koncolawas-web` — restart production service
5. **Check E2E** — verifikasi build output & response live
6. **Commit & Push** — git add → commit → push ke GitHub

> Catatan: Jika build gagal, jangan deploy. Fix dulu sampai build sukses.
> 
> ⚠️ **PENTING**: Setelah `pm2 restart`, selalu verifikasi dengan `curl -s http://localhost:3002/ | grep <expected-text>` untuk memastikan perubahan tampil di live.

---

## Todo — Pengembangan Selanjutnya

### High Priority
- [ ] **UI/UX Overhaul**: activity feed, sidebar grouping, progressive disclosure
- [ ] **Mobile Navigation**: bottom nav 4 tab + more sheet
- [ ] **Business Directory**: direktori usaha alumni dengan approval flow & kategori
- [ ] **Volunteer Skill / Alumni Mengajar**: direktori keahlian alumni yang bisa di-share

### Medium Priority
- [ ] **Dashboard admin**: ringkasan statistik (total alumni, sukses stories, dll)
- [ ] **Notifikasi email**: konfirmasi registrasi, reset password (jika non-Google)
- [ ] **Mobile responsive**: refine layout untuk tampilan HP
- [ ] **CI/CD pipeline**: GitHub Actions untuk lint, build, deploy

### Low Priority
- [ ] **Unit & integration tests**: backend (NestJS) + frontend (Vitest/Cypress)
- [ ] **PWA / offline mode**: service worker untuk akses tanpa internet
- [ ] **Dark mode**: toggle tema gelap
- [ ] **Gallery foto angkatan**: upload & tampilkan foto momen sekolah
- [ ] **SEO & Open Graph**: meta tags untuk setiap halaman publik

> **Catatan status aktual per 2026-05-30:**
> - ✅ **Forum diskusi** — SUDAH implement (threads, nested comments/replies, likes, pagination, categories)
> - ✅ **Upload foto profil** — SUDAH implement (2MB limit, preview, disk storage, old-file cleanup)
> - ✅ **Pencarian & filter alumni** — SUDAH implement (search by nama/NIS, filter by tahun/jurusan/status)
> - ✅ **Export data alumni** — SUDAH implement (CSV + Excel + Stats, admin-only)
> - 🟡 **Dashboard admin** — SUDAH ada basic stats (4 KPI cards + recent users + export), belum ada charts/grafik
> - ❌ **Registrasi alumni mandiri** — belum ada
> - ❌ **Notifikasi email** — belum ada
> - ❌ **Mobile responsive** — masih perlu refine
> - ❌ **CI/CD pipeline** — belum ada
> - ❌ **SEO & Open Graph** — baru terpasang di `/pengurus`, sisanya belum
> - ❌ **Business Directory** — #41 baru dibuka, belum dikerjakan
> - ❌ **Volunteer Skill** — #42 baru dibuka, belum dikerjakan
> 
> Todo list di atas perlu direvisi — beberapa item sudah selesai tapi belum dihapus/ditandai. Priority sebaiknya difokuskan ke yang benar-benar belum ada.

---

## Patroli GitHub Issues — 2026-05-29

### ✅ Terakomodir (Closed/Selesai)
- **#9–#29** Seluruh issues fase MVP1 (login, profil, admin, forum, jobs, notifikasi, dll)
- **#30** Import Google Sheets timeout fix (createMany + chunk)
- **#31** Kelas 1/2/3 tracking
- **#32** Stats overview fix (byYear → byTahunLulus)
- **#33** Kelas 3 di kartu alumni
- **#35** Migrasi dari platform lama
- **#36** Success Stories / Wall of Fame
- **#37** Landing page UX + image compression
- **#38** Build Prisma client hilang di dist (symlink fix)
- **#39** Login 2x klik fix (state:false, session:false)

### ❌ Belum Terakomodir / Open Issues
- **#34** MVP2 Planning — Admin unit, gallery alumni, referral code, donasi (roadmap revised)
- **#41** MVP2 — Business Directory by Alumni (P1 — baru)
- **#42** MVP2 — Volunteer Skill / Alumni Mengajar (P2 — baru)
- **#43** UI/UX — Dashboard Activity Feed + Sidebar Restructure + Progressive Disclosure (P1 — baru)
- **#44** UI/UX — Mobile Navigation Redesign (P1 — baru)

### ✅ Closed via commit (baru ditutup)
- **#40** Redesign halaman pengurus periode sebelumnya (2022–2025) — commit `24867cb` (iprakom)

---

## Session 2026-05-29 (Profil Pengurus IKA)

### Changes
1. **Halaman `/pengurus`**: Halaman profil pengurus IKA dengan tab (Dewan Pembina/Pengawas/Pengurus Pusat/Bidang), card per profil, ditautkan di footer landing page (tidak di sidebar).
2. **Data profil lengkap**: ~70+ entries di `lib/profil-pengurus.ts` dengan field: nama, jabatan, estimasi angkatan, posisi terakhir, ringkasan, foto, kontak LinkedIn/IG, sumber.
3. **Integrasi OSINT jenova.ai**: Data baru — Ibnu Hadyanto (Telkom), Adi Surya Tri Wibowo (Dimensi Gagas), Jaka Pujiyono (Deloitte), Kurnia → Kurnia Adhiwibowo, kontak medsos untuk tokoh publik.
4. **GitHub sync**: commit `bc9911c`
5. **Deploy prod**: pull → build → `pm2 restart koncolawas-web` — verified ✅

### Todo — Profil Pengurus (Prioritas)
1. ✅ **Verifikasi Ali Mahfud** — Drs. H. Ali Mahfud, S.H. — Hakim PA Surakarta (bukan Full Stack Engineer)
2. 🟡 **Cari foto profil** — sebagian sudah (Susilo, Amir, Agus S, Wimboh, Hartanto, Didik, Hadi, Sumardi, Agus I, Suwarno); sisanya via LinkedIn/IG
3. 🔴 **Data masih hilang** — Dun Sridadi, Sayoeti Sukandi, Yulianto (ambigu) — hubungi sekretariat IKA via IG @ikasmansaboy atau Facebook; mayoritas anggota bidang tidak punya jejak digital
4. ✅ **Tambahkan kontak** — LinkedIn/IG untuk semua profil yang memungkinkan
5. ✅ **SEO & meta tags** — title, description, OG tags di `/pengurus` via `useEffect`
6. ✅ **Link di footer app-shell** — untuk pengguna yang sudah login

---

## Session 2026-05-29

### Changes
1. **Login**: Hapus tombol login tengah di landing page, sisakan yang kanan atas
2. **Logo sekolah**: Download dari sman1boyolali.com, pasang sebagai favicon + tampil di beranda
3. **Stats angkatan**: Fix mismatch `byYear` → `byTahunLulus` di landing page
4. **Onboarding flow**: AppShell cek profile setelah login — jika 404 atau tahunMasuk/tahunLulus kosong, redirect ke `/profile`. Banner kuning di profile jika belum lengkap. Tahun Masuk/Lulus diberi red asterisk
5. **Gravatar fallback**: Foto alumni pakai `user.avatarUrl` (dari Google) jika `fotoProfil` belum ada
6. **Sorting alumni**: Default diubah ke `createdAt desc` (terbaru duluan)
7. **Issue #23**: Fix batch import — ganti `create()` loop jadi `createMany()` + chunk 500 rows
8. **README**: Tambah CHANGELOG section, update fitur table
9. **Build verification**: `npx next build` + `npx nest build` sukses ✅

### Issues
- **PM2 stale build**: Perubahan tidak nampak di live karena PM2 masih jalan dengan build lama (uptime 21h). Root cause: workflow tidak menyertakan `pm2 restart` setelah build.

---

## Session 2026-05-29 (Lanjutan)

### Changes
1. **Logo fix**: Ganti logo dari sman1boyolali.com → Wikipedia (`upload.wikimedia.org/wikipedia/id/1/10/Logo_SMAN_1_Boyolali.png`). Sebelumnya pakai logo sekolah umum yang salah.
2. **Deployment docs**: Update workflow Build → **Deploy** → Check E2E. Tambah peringatan ⚠️ agar selalu `pm2 restart` + `curl` verifikasi setelah build.
3. **Jest ESM fix**: Delegated ke background agent.
4. **#34 MVP2 Planning**: Mulai dibahas — donasi, admin unit, gallery alumni, referral code.

### Build verification
- `npx next build` sukses (21.4s, TS pass, 23 routes)
- `npx nest build` sukses
- `pm2 restart koncolawas-api koncolawas-web` ✅
- Live test: logo ✅, login button ✅, stats (71 alumni, 4 angkatan) ✅

---

## Session 2026-05-29 (Malam)

### Changes
1. **Favicon & logo**: Logo dikompres 212KB→38KB (pngquant). Favicon.ico dibuat dari logo compressed agar load lebih cepat.
2. **Landing page redesign**: Header dihapus total. Tombol login cuma 1 di tengah (bawah nama sekolah). Tampilan lebih simpel dan fokus.
3. **Login 2x klik fix**: Root cause — `passport-google-oauth20` default `state:true` (CSRF) + Passport `session` default tanpa session middleware. Fix: tambah `state: false` di GoogleStrategy + `session: false` di PassportModule.
4. **Button rebrand**: "Login with Google" → "Masuk sebagai Alumni" + SVG logo Google di kiri.
5. **Logout redirect**: Semua redirect `/login` diganti ke `/` (landing page), termasuk di auth-context, api.ts, callback, admin layout, app-shell.
6. **Build fix**: Backend `npm run build` sudah pakai symlink `dist/src/generated → ../../src/generated` untuk Prisma client, tapi sebelumnya dijalanin `npx nest build` langsung tanpa symlink. Build script sudah benar (`npm run build`).

### Bugs Fixed (sebagai issue tracker)
- **#39** Login perlu 2x klik — fixed via `state:false` + `session:false`
- **#37** Landing page jelek & lambat — fixed via redesign + kompresi gambar
- **#38** Build gagal karena Prisma client hilang — fixed via `npm run build` (pakai symlink)

### Build verification
- `npx next build` sukses (13.2s, TS pass, 23 routes)
- `npm run build` backend sukses
- `pm2 restart koncolawas-api koncolawas-web` ✅
- Live test: logo compressed ✅, "Masuk sebagai Alumni" ✅, Google SVG ✅, stats (71, 4, 1) ✅, no header ✅, 1 login button ✅

---

## Session 2026-05-29 (Profil Pengurus — Final)

### Changes
1. **Bupati Boyolali dikoreksi**: Kandiyono → **Agus Irawan** (bupati terpilih 2025-2030) + foto Wikipedia.
2. **Prof. Suwarno ditambahkan**: Guru Besar Teknik Elektro ITB, top 2% Stanford, foto dari ITB.
3. **Bio diperkaya**: Susilo Siswoutomo (lahir Boyolali, ITB 1970), Wimboh Santoso (S1 UNS 1983, PhD Loughborough), Agus Suryonugroho (Akpol 1991), Didik Haryadi (lahir 12 Nov 1976).
4. **SEO meta tags**: title/description/OG untuk `/pengurus`.
5. **Footer link**: "Profil Pengurus IKA" di app-shell untuk user login.
6. **Halaman `/pengurus/sebelumnya`**: Struktur 2022-2025 dari SK, 80+ entri.
7. **Cross‑reference SK**: 10 profil dicocokkan dengan angkatan A-xx.

### Data terverifikasi (Perplexity + OSINT)
- **Ali Mahfud** → Drs. H. Ali Mahfud, S.H. — Hakim PA Surakarta (bukan Full Stack Engineer)
- **Andy Arvianto** → Dir. SDM PT Pertamina (Juni 2025)
- **Bambang Widjajarso** → Trainer Pusdiklat PSDM Kemenkeu
- **Wartono** → IG @wartonoboyolali

### Blocked (perlu kontak internal)
- Dun Sridadi, Sayoeti Sukandi, Yulianto — tidak ditemukan data publik
- Mayoritas bidang/sub-bidang tidak punya jejak digital

### Commit history (8 commits dari sesi ini)
- `24867cb` — feat: redesign halaman pengurus periode sebelumnya (iprakom) — closes #40
- `dc89175` — docs: update session profil pengurus final
- `e756351` — feat: tambah Prof. Suwarno, koreksi Bupati Agus Irawan, perkaya bio
- `98df049` — Halaman kepengurusan lama + cross-ref SK
- `ed34863` — Update profil: foto Amir Yanto, Hadi Pratomo, Sri Yunanto
- `22a5a6a` — Update data: Ali Mahfud, Andy, Bambang, foto Hartanto & Didik, SEO, footer
- `5a0047a` — update: Kurnia Adhiwibowo — data lengkap (BPS)
- `2994241` — docs: update AGENTS.md — todo profil pengurus & session log

## Session 2026-05-30 — OSINT Profil Pengurus (Paralel Agent)

### Changes
1. **Google Sheets sync**: Kedua sheet (`PENGURUS LAMA` & `PENGURUS BARU`) diseragamkan — 24 kolom identik (No–Catatan Internal). Bold header + freeze row.
2. **OSINT 4 agent paralel**: 
   - **LAMA Top** (33 profil: Dewan Pembina + Penasehat + Pakar) → 10 foto, 9 LinkedIn, 6 Wikipedia, 20 ringkasan baru
   - **LAMA Pusat** (62 profil) → 4 foto, 2 LinkedIn, 12 ringkasan baru, 47 tanpa jejak digital
   - **BARU Top** (28 profil: Dewan Pembina + Pengawas) → 7 foto, 6 LinkedIn, 4 Instagram, 15 ringkasan diperkaya
   - **BARU Staff** (39 profil: Pengurus Pusat + Bidang) → 1 foto, 8 LinkedIn, 6 Instagram, 39 ringkasan
3. **Sheet → TypeScript sync**: Script `sync-sheet-to-ts.js` mengupdate `profil-pengurus.ts` (+271 field patches) dan `profil-pengurus-lama.ts` (+50 field patches) — foto, ringkasan, LinkedIn, Instagram, kontak, gender, sumber dari hasil OSINT.
4. **Figur kunci teridentifikasi**: 
   - LAMA: Jend. Mulyono, Mayjen Sumardi, Djoko Kirmanto, Irjen Erwin Triwanto, Prof. Suwarno (semua +Wikipedia & foto), Sumarno (Sekda Jateng), Yoyok Hery (Warung SS), Ratri Survivalina (Kadinkes)
   - BARU: Andy Arvianto (Dir SDM Pertamina), Kurnia Adhiwibowo (BPS), Adi Surya Tri Wibowo (Ketum HDII), Ibnu Hadyanto (Telkom), Jaka Pujiyono (Deloitte)
5. **Unified pipeline**: `export-sheet-json.js` → `merge-osint-results.js` → `sync-sheet-to-ts.js`

### Sheet → Code Pipeline
```
Google Sheet (master data)
  → export-sheet-json.js (baseline JSON per kategori)
  → OSINT agents (webSearch, findings JSON)
  → merge-osint-results.js (push ke sheet)
  → sync-sheet-to-ts.js (patch TypeScript dari sheet)
  → npx next build + npm run build + pm2 restart
```

### Delta (PENGURUS LAMA)
| Field | Sebelum | Sesudah |
|-------|---------|---------|
| Foto | 5 | **13** |
| Ringkasan | 12 | **93** |
| Wikipedia | 0 | **8** |
| LinkedIn | 0 | **6** |
| Instagram | 0 | **2** |
| Sumber | 0 | **31** |

### Delta (PENGURUS BARU)
| Field | Sebelum | Sesudah |
|-------|---------|---------|
| Foto | 10 | **12** |
| Ringkasan | 43 | **65** |
| Wikipedia | 0 | **6** |
| LinkedIn | 0 | **10** |
| Instagram | 0 | **9** |
| Sumber | 46 | **66** |

### Remaining P1 (butuh foto)
- **82 profil LAMA** + **55 profil BARU** = **137 tanpa foto**
- Foto sumber terbuka adalah bottleneck; perlu kontak internal IKA via IG/FB

### Build & Deploy
- `npx next build` sukses — 26 routes ✅
- `npm run build` backend sukses ✅
- `pm2 restart koncolawas-web koncolawas-api` ✅
- Live verified: `/pengurus` (Susilo, Agus Irawan, Sumardi ✅), `/pengurus/sebelumnya` (Seno Kusumoarjo, Budiyanto ✅)

---

## Session 2026-05-30 (MVP2 Planning — Business Directory)

### PM Analysis: Ide dari Founder

Founder menyampaikan 7 area pengembangan untuk MVP2. Sebagai PM kritis, dilakukan validasi:

| Ide | Verdict | Alasan |
|-----|---------|--------|
| **Business Directory** | ✅ **P1 - Kerjakan** | Inti permintaan. CRUD sederhana, high impact, no payment integration |
| **Volunteer Skill** | ✅ **P2 - Kerjakan** | Clear value, relatif ringan, integrasi profil |
| **Collaboration (Cari Mitra)** | ✅ **P3 - Bagian dari Bisnis** | Flag + admin mediasi, lightweight |
| Job Opportunity | ❌ **Skip** | Sudah ada Jobs Board |
| Promotion tipis-tipis | ❌ **Skip** | Tercover Business Directory |
| Program SMA | ⏸️ **Tunda** | Terlalu broad, perlu definisi |
| Crowd Funding | ⏸️ **Tunda ke MVP3** | Butuh payment gateway, legal, risiko tinggi |

### Issues Created
- **#41** — [MVP2] Business Directory by Alumni (P1)
- **#42** — [MVP2] Volunteer Skill / Alumni Mengajar (P2)
- **#34** — Roadmap direvisi: Business Directory & Volunteer Skill sebagai prioritas baru. Admin Unit, Gallery, Referral, Donasi ditunda.

### Teknis
- **Business Directory**: model `AlumniBusiness`, enum `BusinessCategory` + `BusinessStatus`, approval flow, upload foto, halaman `/bisnis`
- **Volunteer Skill**: model `AlumniSkill` + `SkillRequest`, enum `SkillFormat` + `SkillLevel`, halaman `/alumni-mengajar`
- Pattern mengikuti `success-stories` (controller + service + dto + module, tanpa base CRUD)
- Frontend: halaman baru di `(app)/bisnis` dan `(app)/alumni-mengajar` sebagai Client Component, pakai `fetchApi` dari `@/lib/api`

### UI/UX Analisis Feature Bloat
Platform punya 8+ fitur → user non-teknis kewalahan. Mitigasi via 3 strategi:
1. **Activity Feed** — Dashboard jadi unified feed lintas fitur (bukan 3 KPI card + 2 widget terisolasi)
2. **Sidebar Grouping** — 10 menu flat → 4 kategori expandable (Jaringan, Karir & Usaha, Komunitas, Profil)
3. **Progressive Disclosure** — fitur muncul bertahap berdasarkan stage user (baru login → profile OK → aktif → senior)

### Issues Created
- **#41** — [MVP2] Business Directory by Alumni (P1)
- **#42** — [MVP2] Volunteer Skill / Alumni Mengajar (P2)
- **#43** — [UI/UX] Dashboard Activity Feed + Sidebar Restructure + Progressive Disclosure
- **#44** — [UI/UX] Mobile Navigation Redesign — Bottom Nav + More Sheet
- **#34** — Roadmap direvisi: prioritas baru UI/UX #43 #44 + Business Directory #41 + Volunteer Skill #42. Admin Unit, Gallery, Referral, Donasi ditunda.

