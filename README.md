# Konco Lawas — Platform Alumni SMA N 1 Boyolali

Platform digital untuk menghubungkan, memfasilitasi komunikasi, dan mendokumentasikan data alumni SMA N 1 Boyolali. Menyediakan direktori alumni, forum diskusi, jobs board, peta sebaran alumni, dan dashboard statistik.

---

## Tech Stack

| Layer      | Teknologi                                        |
| ---------- | ------------------------------------------------ |
| Backend    | NestJS 11 + Prisma 7 + MySQL 8                   |
| Frontend   | Next.js 16 + Tailwind CSS v4 + Leaflet           |
| Auth       | Google SSO (Passport Google OAuth 2.0) + JWT     |
| Realtime   | Socket.IO (chat & notifikasi)                    |
| Proxy      | Nginx reverse proxy                              |

---

## Arsitektur

```
┌─────────┐     ┌──────────────┐     ┌──────────┐
│  Client  │ ──► │  Nginx (443) │ ──► │  API :3001 │
└─────────┘     │  Reverse     │     │  NestJS   │
                │  Proxy       │     └──────────┘
                │              │     ┌──────────┐
                │              │ ──► │  Web :3002 │
                └──────────────┘     │  Next.js  │
                                     └──────────┘
```

- **API**: `localhost:3001` — NestJS REST API
- **Web**: `localhost:3002` — Next.js SSR + SPA
- **Database**: MySQL 8 via Docker (`docker-compose.yml`)
- **Static File**: `backend/uploads/` untuk unggahan

---

## Setup & Development

### Prasyarat

- Node.js >= 20
- MySQL 8 (via Docker atau lokal)
- PM2 (untuk production)

### 1. Clone & Install Dependencies

```bash
git clone <repo-url> && cd koncolawas
npm install               # root (concurrently)
npm install --prefix backend
npm install --prefix frontend
```

### 2. Environment Variables

Buat `backend/.env`:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/koncolawas

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://domain.com/api/auth/google/callback

# JWT
JWT_SECRET=your-jwt-secret

# App
PORT=3001
FRONTEND_URL=https://domain.com

# Google Sheets API (untuk import)
GOOGLE_SHEETS_API_KEY=your-api-key
```

### 3. Database

```bash
docker compose up -d          # jalankan MySQL
npm run db:migrate            # prisma migrate dev
npm run db:generate           # prisma generate
```

### 4. Jalankan Development

```bash
npm run dev                   # backend :3001 + frontend :3002 concurrently
```

Atau terpisah:

```bash
npm run dev:backend           # backend saja
npm run dev:frontend          # frontend saja
```

### 5. Production dengan PM2

```bash
npm run build                 # build backend + frontend
pm2 start ecosystem.config.cjs
pm2 save
```

### Update Production (setelah perubahan kode)

```bash
npm run build                 # rebuild backend + frontend
pm2 restart koncolawas-api koncolawas-web   # restart PM2 processes
# Verifikasi: curl -s http://localhost:3002/ | grep <expected-text>
```

> ⚠️ **PENTING**: Setelah `npm run build`, PM2 WAJIB di-restart (`pm2 restart`). Tanpa restart, PM2 masih menjalankan build lama dan perubahan tidak akan nampak di live site. Selalu verifikasi dengan curl setelah restart.

---

## Fitur yang Dikembangkan

| Fitur                                   | Status        |
| --------------------------------------- | ------------- |
| Google SSO Auth                         | ✅ Selesai    |
| Profil Alumni (kelas 1/2/3, update)     | ✅ Selesai    |
| Forum Diskusi (kategori, thread, reply) | ✅ Selesai    |
| Jobs Board (posting, approval)          | ✅ Selesai    |
| Peta Alumni dengan Heatmap              | ✅ Selesai    |
| Dashboard Statistik                     | ✅ Selesai    |
| Admin Panel (users, jobs, kategori)     | ✅ Selesai    |
| Admin — Import Data Legacy              | ✅ Selesai    |
| Alumni Berprestasi / Wall of Fame       | ✅ Selesai    |
| Migrasi Data dari Platform Lama         | ✅ Selesai    |
| Edu & Career History                    | ✅ Selesai    |
| Onboarding Flow (tahunMasuk/tahunLulus) | ✅ Selesai    |
| Google Sheets Import (batch)            | ✅ Selesai    |
| Gravatar/Google Avatar Fallback         | ✅ Selesai    |
| Chat Real-time (Socket.IO)              | 📋 Direncanakan |
| Weekly Digest Email                     | 📋 Direncanakan |

---

## Status Migrasi dari Platform Lama

Sumber data: [koncolawas2005.web.app](https://koncolawas2005.web.app)

- **Endpoint GAS backend** ditemukan dengan 2 sumber data
- **67 profil alumni** dengan email — siap di-import
- **350 nama master** di sheet `"AlumniData"` — menunggu akses publik

### Endpoint Import

```
POST /import/from-legacy
GET  /import/from-legacy/progress
GET  /import/from-legacy/dry-run
```

Mapping 15 field dari GAS ke `User` + `AlumniProfile`.

---

## Environment Variables

| Variable              | Wajib | Keterangan                           |
| --------------------- | ----- | ------------------------------------ |
| `DATABASE_URL`        | ✅    | MySQL connection string              |
| `GOOGLE_CLIENT_ID`    | ✅    | Google OAuth 2.0 Client ID           |
| `GOOGLE_CLIENT_SECRET`| ✅    | Google OAuth 2.0 Client Secret       |
| `GOOGLE_CALLBACK_URL` | ✅    | Callback URL untuk OAuth             |
| `JWT_SECRET`          | ✅    | Secret key untuk JWT signing         |
| `PORT`                | ❌    | Port API (default 3001)              |
| `FRONTEND_URL`        | ✅    | URL frontend (CORS + redirect)       |
| `GOOGLE_SHEETS_API_KEY`| ✅   | API Key untuk Google Sheets import   |

---

## Deployment

### PM2 Ecosystem

```js
// ecosystem.config.cjs — lihat file di root proyek
module.exports = {
  apps: [
    { name: 'koncolawas-api', cwd: './backend', script: 'dist/src/main.js', instances: 1 },
    { name: 'koncolawas-web', cwd: './frontend', script: 'node_modules/.bin/next', args: 'start --port 3002', instances: 1 },
  ],
}
```

### Nginx Reverse Proxy (referensi)

```nginx
server {
    listen 443 ssl;
    server_name sma.kotakpasir.my.id;

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
    }

    location /uploads/ {
        alias /home/ubuntu/koncolawas/backend/uploads/;
    }
}
```

---

## Changelog

### 2026-05-31
- **Issue #46**: Redesign `alumni-berprestasi.html` — team member card layout (120px photo left + info right), stacks on mobile
- **Bug fix**: HTML escaping `">` visible text — ganti inline `onerror` dengan `handleImageError()` JS function
- **Typography**: Playfair Display + Source Sans 3 (Google Fonts) — lebih editorial
- **Gender inline**: Pindah dari card-footer ke badge angkatan
- **Social media**: field `linkedin`/`instagram`/`twitter` + SVG icon row (render jika data ada)
- **Citation**: Auto-extract `Informan:` dari ringkasan ke blok khusus di card bottom
- **OSINT system**: Dokumentasi lengkap di `docs/osint-agent-system.md` — source priority chains, Playwright protocol, verification workflow, batch runner script
- **Workflow diperkuat**: Setiap perubahan WAJIB mulai dari GitHub Issue (#0), commit Wajib mention issue
- **Issue #47**: Floating filter icon — sticky filter bar diganti dengan FAB (floating action button) di pojok kanan bawah + slide-up filter panel + sticky heading "Alumni Berprestasi" saja saat scroll

### 2026-05-29
- **Onboarding flow**: Pengguna baru diarahkan ke `/profile` untuk mengisi tahun masuk & tahun lulus sebelum mengakses fitur lain
- **Gravatar fallback**: Foto alumni menggunakan Google avatar jika foto profil belum diupload
- **Sorting alumni**: Default sorting diubah ke `createdAt desc` (terbaru duluan)
- **Stats fix**: Perbaikan field name mismatch `byYear` → `byTahunLulus`
- **Logo fix**: Ganti logo dari sekolah umum → logo resmi SMAN 1 Boyolali dari Wikipedia
- **Kompresi gambar**: Logo 212KB → 38KB via pngquant. Favicon dari logo compressed.
- **Landing page redesign**: Header dihapus, 1 tombol login di tengah, tampilan simpel.
- **Login 2x klik fix**: Root cause `state:true` (CSRF) tanpa session → fix `state:false` + `session:false`
- **Button rebrand**: "Login with Google" → "Masuk sebagai Alumni" + SVG logo Google
- **Logout redirect**: Semua redirect `/login` → `/` (landing page)
- **Build fix**: Backend pakai symlink `dist/src/generated → ../../src/generated` untuk Prisma client
- **Issue #37 #38 #39**: Dibuat sebagai tracker bug
- **Deployment docs**: Update workflow — **Build → Deploy (`pm2 restart`) → Check E2E**

### 2026-05-28
- **Kelas tracking**: `kelas1`, `kelas2`, `kelas3` di model, DTO, form, dan public profile
- **Success Stories**: Model + CRUD + halaman `/sukses` + admin panel
- **Import Legacy**: `POST /import/from-legacy` untuk migrasi 67 alumni
- **Google Sheets import**: `POST /import/from-sheet` + CSV upload
- **Batch processing**: `createMany` + chunking 500 rows untuk import sheet

### 2026-05-XX (MVP Launch)
- Google SSO Auth + JWT
- Alumni profile CRUD dengan foto upload
- Forum diskusi dengan kategori, thread, reply, pagination
- Jobs board dengan posting & approval
- Peta alumni dengan Leaflet + heatmap
- Dashboard statistik realtime
- Admin panel (users, jobs, categories, success stories)
- Chat real-time dengan Socket.IO
- Notifikasi sistem
- Multi-bahasa (ID/EN)
- Responsive mobile layout

---

## Links

- **Issues**: [GitHub Issues](https://github.com/camagenta/koncolawasboyolali/issues)
- **Live Site**: [sma.kotakpasir.my.id](https://sma.kotakpasir.my.id)
- **Dokumentasi Lengkap**: Lihat `PRD_Koncolawas.md`, `Technical_Specification.md`, `Database_Schema_ERD.md`, `UI_UX_Wireframe.md`
