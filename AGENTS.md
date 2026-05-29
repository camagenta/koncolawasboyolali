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
- **#36** Success Stories / Wall of Fame — sudah ada model, CRUD, frontend
- **#35** Migrasi dari platform lama — sudah ada ImportController + fromLegacy
- **#33** Kelas 3 di kartu alumni — sudah menampilkan `kelas3` di kartu
- **#31** Kelas 1/2/3 tracking — sudah di schema, DTO, dan frontend
- **#24** Filter tahun alumni — sudah diperpanjang ke 80 tahun
- **#30** Import sheets — sudah bisa via Google Sheets API + CSV

### ⚠️ Butuh Perbaikan
- **#32** Stats overview tidak lengkap — **TELAH DIPERBAIKI**: landing page pakai `byTahunLulus` (sebelumnya `byYear` mismatch)
- **#23** Import Google Sheets timeout — **MASIH TERBUKA**: masih pakai `for` loop `create()` satu per satu, perlu `createMany` + chunking

### ❌ Belum Terakomodir
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
