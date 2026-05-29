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
- [ ] **Forum diskusi**: real threads/comments dengan fitur reply & pagination
- [ ] **Registrasi alumni mandiri**: form pendaftaran dengan validasi data
- [ ] **Upload foto profil**: integrasi dengan endpoint update profile + preview
- [ ] **Pencarian & filter alumni**: search by nama, angkatan, kelas, kota

### Medium Priority
- [ ] **Dashboard admin**: ringkasan statistik (total alumni, sukses stories, dll)
- [ ] **Notifikasi email**: konfirmasi registrasi, reset password (jika non-Google)
- [ ] **Mobile responsive**: refine layout untuk tampilan HP
- [ ] **Export data alumni**: CSV/Excel download dari admin panel
- [ ] **CI/CD pipeline**: GitHub Actions untuk lint, build, deploy

### Low Priority
- [ ] **Unit & integration tests**: backend (NestJS) + frontend (Vitest/Cypress)
- [ ] **PWA / offline mode**: service worker untuk akses tanpa internet
- [ ] **Dark mode**: toggle tema gelap
- [ ] **Gallery foto angkatan**: upload & tampilkan foto momen sekolah
- [ ] **SEO & Open Graph**: meta tags untuk setiap halaman publik

---

## Patroli GitHub Issues — 2026-05-29

### ✅ Terakomodir (Closed/Selesai)
- **#36** Success Stories / Wall of Fame
- **#35** Migrasi dari platform lama
- **#33** Kelas 3 di kartu alumni
- **#31** Kelas 1/2/3 tracking
- **#24** Filter tahun alumni
- **#30** Import sheets
- **#32** Stats overview fix (byYear → byTahunLulus)
- **#23** Import Google Sheets timeout fix (createMany + chunk)
- **#37** Login 2x klik fix (state:false, session:false)
- **#38** Landing page UX + image compression
- **#39** Build Prisma client hilang di dist (symlink fix)

### ❌ Belum Terakomodir / Open Issues
- **#34** MVP2 Planning — Admin unit, gallery alumni, referral code, donasi

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
- **#37** Login perlu 2x klik — fixed via `state:false` + `session:false`
- **#38** Landing page jelek & lambat — fixed via redesign + kompresi gambar
- **#39** Build gagal karena Prisma client hilang — fixed via `npm run build` (pakai symlink)

### Build verification
- `npx next build` sukses (13.2s, TS pass, 23 routes)
- `npm run build` backend sukses
- `pm2 restart koncolawas-api koncolawas-web` ✅
- Live test: logo compressed ✅, "Masuk sebagai Alumni" ✅, Google SVG ✅, stats (71, 4, 1) ✅, no header ✅, 1 login button ✅
