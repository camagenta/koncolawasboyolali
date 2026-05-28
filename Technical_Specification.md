# Technical Specification — Koncolawas

## 1. Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| **Frontend Web** | Next.js (React) | SSR/SSG, routing built-in, SEO untuk landing page, React ecosystem |
| **Mobile** | React Native (Expo) | Code sharing dengan web (types, hooks, utils), satu bahasa (JS/TS) |
| **Backend** | Node.js — NestJS | TypeScript, modular, decorator pattern, dokumentasi otomatis (Swagger) |
| **Database** | MySQL 8+ | Relasional, spatial extensions untuk peta, familiar & mature |
| **ORM** | Prisma | Type-safe, migration, auto-generate types, relations |
| **Auth** | Google OAuth 2.0 + JWT | Google SSO login, JWT untuk session |
| **Storage** | MinIO / S3-compatible | Foto profil, file chat, dokumen |
| **Realtime** | WebSocket (Socket.io) | Chat, notifikasi real-time |
| **Map** | Leaflet (MapLibre) | Open source, gratis, ringan |
| **Search** | MySQL FULLTEXT index | Full-text search native di MySQL |
| **Deployment** | Vercel (FE) + Railway/Render (BE) | Simple, scalable, affordable for MVP |
| **CI/CD** | GitHub Actions | Lint, test, build, deploy otomatis |

---

## 2. Arsitektur

### 2.1 High-Level Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │     │  React Native│     │  Google OAuth│
│  (Web App)   │     │  (Mobile)    │     │   2.0        │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └─────────┬──────────┘                    │
                 │  HTTPS/REST                   │
                 ▼                               │
       ┌──────────────────┐                      │
       │   NestJS API     │◄─────────────────────┘
       │   (Backend)      │
       └────────┬─────────┘
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
┌─────────┐ ┌────────┐ ┌──────┐
│  MySQL   │ │  MinIO │ │Redis │
│ (Data)   │ │ (File) │ │(Cache│
│ (Spatial) │ │        │ │ /Sess│
└─────────┘ └────────┘ └──────┘
```

### 2.2 Backend Module Structure (NestJS)

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── guards/           # Auth guard, Role guard
│   ├── decorators/       # @CurrentUser, @Roles
│   ├── filters/          # Exception filter
│   ├── interceptors/     # Transform response, logging
│   └── pipes/            # Validation pipe
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── strategies/   # Google OAuth strategy
│   ├── users/
│   ├── alumni/
│   │   ├── profiles/
│   │   ├── education/
│   │   └── career/
│   ├── forums/
│   │   ├── categories/
│   │   ├── threads/
│   │   ├── comments/
│   │   └── likes/
│   ├── chat/
│   │   ├── personal/
│   │   ├── groups/
│   │   └── gateway/      # WebSocket gateway
│   ├── jobs/
│   ├── maps/
│   ├── admin/
│   └── import/           # Import buku induk CSV
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── i18n/
    ├── id/               # Indonesian translations
    └── en/               # English translations
```

---

## 3. API Design

### 3.1 Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.koncolawas.com/api`

### 3.2 Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/auth/google` | Redirect to Google OAuth |
| GET | `/auth/google/callback` | OAuth callback handler |
| POST | `/auth/refresh` | Refresh JWT token |
| GET | `/auth/me` | Get current user info |
| POST | `/auth/logout` | Invalidate session |

### 3.3 Alumni / Profile Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/alumni/profile` | Get my profile |
| PUT | `/alumni/profile` | Update my profile |
| GET | `/alumni/profile/suggestions` | Autocomplete dari buku induk |
| POST | `/alumni/profile/claim` | Klaim data dari buku induk |
| GET | `/alumni/educations` | List riwayat pendidikan |
| POST | `/alumni/educations` | Tambah riwayat pendidikan |
| PUT | `/alumni/educations/:id` | Update riwayat pendidikan |
| DELETE | `/alumni/educations/:id` | Hapus riwayat pendidikan |
| GET | `/alumni/careers` | List riwayat pekerjaan |
| POST | `/alumni/careers` | Tambah riwayat pekerjaan |
| PUT | `/alumni/careers/:id` | Update riwayat pekerjaan |
| DELETE | `/alumni/careers/:id` | Hapus riwayat pekerjaan |

### 3.4 Forum Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/forums/categories` | List kategori forum |
| POST | `/forums/categories` | Buat kategori (admin) |
| GET | `/forums/threads?category_id=` | List thread per kategori |
| POST | `/forums/threads` | Buat thread baru |
| GET | `/forums/threads/:id` | Detail thread + komentar |
| PUT | `/forums/threads/:id` | Update thread |
| DELETE | `/forums/threads/:id` | Hapus thread |
| POST | `/forums/threads/:id/pin` | Pin thread (admin) |
| GET | `/forums/comments?thread_id=` | List komentar |
| POST | `/forums/comments` | Tambah komentar |
| DELETE | `/forums/comments/:id` | Hapus komentar (owner/admin) |
| POST | `/forums/likes` | Like/unlike thread/comment |

### 3.5 Chat & Grup Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/chat/groups` | List grup saya |
| POST | `/chat/groups` | Buat grup baru |
| GET | `/chat/groups/:id` | Detail grup + anggota |
| POST | `/chat/groups/:id/join` | Gabung grup |
| POST | `/chat/groups/:id/leave` | Keluar grup |
| GET | `/chat/messages?group_id=&receiver_id=` | Riwayat chat |
| POST | `/chat/messages` | Kirim pesan |
| WS | `/chat/ws` | WebSocket chat real-time |

### 3.6 Lowongan Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/jobs` | List lowongan (public) |
| POST | `/jobs` | Posting lowongan baru |
| GET | `/jobs/:id` | Detail lowongan |
| PUT | `/jobs/:id` | Update lowongan (owner) |
| DELETE | `/jobs/:id` | Hapus lowongan (owner/admin) |
| PUT | `/jobs/:id/approve` | Approve lowongan (admin) |
| PUT | `/jobs/:id/reject` | Tolak lowongan (admin) |

### 3.7 Admin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | Dashboard stats |
| GET | `/admin/alumni` | List semua alumni |
| POST | `/admin/alumni/import` | Import buku induk CSV |
| GET | `/admin/alumni/import/history` | Riwayat import |
| PUT | `/admin/alumni/:id/verify` | Verifikasi data alumni |
| GET | `/admin/units` | List admin unit |
| POST | `/admin/units` | Tambah admin unit |
| DELETE | `/admin/units/:id` | Hapus admin unit |
| PUT | `/admin/settings` | Update pengaturan sistem |

### 3.8 Map / Statistics Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/maps/alumni` | Data sebaran untuk peta |
| GET | `/statistics/summary` | Statistik ringkasan |
| GET | `/statistics/by-angkatan` | Statistik per tahun masuk |
| GET | `/statistics/by-kota` | Statistik per kota domisili |
| GET | `/statistics/by-kecamatan` | Statistik per kecamatan asal |
| GET | `/statistics/by-sektor` | Statistik per sektor pekerjaan |

---

## 4. Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ALUMNI_NOT_FOUND",
    "message": "Data alumni tidak ditemukan",
    "details": { ... }
  }
}
```

### Pagination
- Query params: `?page=1&limit=20&sort=created_at:desc`
- Default: `page=1`, `limit=10`, `sort=created_at:desc`

### Filtering
- `?tahun_masuk=2005`
- `?kelas_3=XII-1`
- `?kota_domisili=Jakarta`
- `?search=Ahmad` (fuzzy nama)

---

## 5. WebSocket Events (Socket.io)

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `chat:send` | `{ receiver_id?, group_id?, message }` | Kirim pesan |
| `chat:typing` | `{ receiver_id?, group_id? }` | Indikator mengetik |
| `chat:read` | `{ message_ids[] }` | Tandai sudah dibaca |
| `forum:join` | `{ thread_id }` | Bergabung ke room thread |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `chat:message` | `{ message }` | Pesan baru |
| `chat:typing` | `{ user_id, name }` | Seseorang mengetik |
| `notification:forum` | `{ type, data }` | Notifikasi forum |
| `notification:job` | `{ type, data }` | Notifikasi lowongan baru |

---

## 6. Autentikasi Flow Detail

```
[User] → Click "Masuk dengan Google"
    → Redirect ke `/auth/google`
    → Google OAuth consent screen
    → Redirect ke `/auth/google/callback`
    → Backend:
        1. Terima code dari Google
        2. Tukar code → access_token
        3. Fetch user info (name, email, google_id, avatar)
        4. Cek user exist by google_id
           ├─ Exist → Update last_login, generate JWT
           └─ Not exist → Buat user baru (role: alumni), generate JWT
        5. Set JWT cookie (httpOnly, secure, sameSite: lax)
    → Redirect ke dashboard

[Setiap Request]:
    → Client: Kirim JWT via Authorization header or cookie
    → Backend: JWT Guard → validate → inject user ke request
```

### JWT Payload
```json
{
  "sub": "user-uuid",
  "email": "user@email.com",
  "role": "alumni",
  "iat": 1234567890,
  "exp": 1234597890
}
```

### JWT Lifetime
- Access Token: 24 jam
- Refresh Token: 30 hari (di-cookie)

---

## 7. Prisma Schema Highlights

### Key Relations

```prisma
model User {
  id            String   @id @default(uuid())
  googleId      String   @unique
  email         String   @unique
  name          String
  role          UserRole @default(alumni)
  avatarUrl     String?
  isActive      Boolean  @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  profile       AlumniProfile?
  adminUnit     AdminUnit?
  forumThreads  ForumThread[]
  forumComments ForumComment[]
  groupMembers  GroupMember[]
  sentMessages  ChatMessage[]   @relation("sender")
  recvMessages  ChatMessage[]   @relation("receiver")
  jobPostings   JobPosting[]
  approvedJobs  JobPosting[]    @relation("approver")
}

model AlumniProfile {
  id                    String        @id @default(uuid())
  userId                String        @unique
  user                  User          @relation(fields: [userId], references: [id])
  bukuIndukId           String?
  bukuInduk             BukuIndukRef? @relation(fields: [bukuIndukId], references: [id])
  nis                   String?
  namaLengkap           String
  noHp                  String
  tahunMasuk            Int
  tahunLulus            Int
  jurusan               String?
  kelas1                String?
  kelas2                String?
  kelas3                String
  kotaDomisili          String
  kecamatanAsalBoyolali String
  alamatLengkap         String?
  fotoProfil            String?
  linkLinkedin          String?
  linkInstagram         String?
  statusUtama           StatusUtama  @default(lainnya)
  isDataFromBukuInduk   Boolean      @default(false)
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  educations EducationHistory[]
  careers    CareerHistory[]
}

model BukuIndukRef {
  id         String       @id @default(uuid())
  nis        String       @unique
  nama       String
  tahunMasuk Int
  jurusan    String?
  kelas3     String?
  isMatched  Boolean      @default(false)
  matchedBy  String?
  matchedUser User?      @relation(fields: [matchedBy], references: [id])
  createdBy  String?      @default(now())
  updatedAt  DateTime?    @updatedAt
}
```

---

## 8. Database Migration Strategy

| Fase | Action |
|---|---|
| **Development** | `npx prisma db push` — sync schema langsung |
| **Staging/Prod** | `npx prisma migrate deploy` — versioned migrations |
| **Seed** | `npx prisma db seed` — data dummy untuk testing |

---

## 9. Environment Variables

```
# Backend (.env)
DATABASE_URL=mysql://user:pass@localhost:3306/koncolawas
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
JWT_SECRET=xxx
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
MINIO_BUCKET=koncolawas
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## 10. i18n Strategy

- Library: `next-i18next` (Next.js) / `i18next` (NestJS)
- File structure:
  ```
  - frontend/public/locales/{id,en}/common.json
  - backend/src/i18n/{id,en}/messages.json
  ```
- Deteksi bahasa: `Accept-Language` header + preferensi user
- Default: Bahasa Indonesia
- Keys: `profile.name`, `forum.thread.create`, `job.apply`

---

## 11. Performance Targets

| Metrik | Target |
|---|---|
| API Response (p95) | < 200ms |
| Page Load (First Paint) | < 1.5 detik |
| Time to Interactive | < 3 detik |
| Database Query (p95) | < 100ms |
| Concurrent Users | 500 (MVP) |
| Data Volume | 10.000+ alumni |

---

## 12. Security Checklist

- [x] Google OAuth 2.0 (no password storage)
- [x] JWT httpOnly cookie (XSS protection)
- [x] Rate limiting (100 req/min per user)
- [x] Input validation (class-validator + Zod)
- [x] SQL injection protection (Prisma parameterized queries)
- [x] File upload validation (type, size limit — 5MB)
- [x] CORS whitelist (frontend domain only)
- [x] Helmet middleware (security headers)
- [x] RBAC (Role-Based Access Control) on every endpoint
- [x] Data encryption at rest (MySQL)
- [x] HTTPS only (production)

---

## 13. Monitoring & Logging (Post-MVP)

| Tool | Fungsi |
|---|---|
| Sentry | Error tracking |
| Logtail / Grafana Loki | Log aggregation |
| Grafana + Prometheus | Metrics & monitoring |
| Better Stack Uptime | Uptime monitoring |

---

*Dokumen ini akan terus diperbarui seiring development.*
