# OSINT Agent System — Profiling Alumni

> Dibuat: 2026-05-31 | Revisi dari pengalaman riset foto 49 Alumni Berprestasi

---

## 1. Retrospective: What Worked & What Didn't

### Source Hit Rate (dari 49 alumni)

| Source Type | Coba | Berhasil | Hit Rate | Contoh |
|-------------|------|----------|----------|--------|
| **Wikipedia Commons** | 12 | 5 | 42% | Djoko Kirmanto, Susilo, Mulyono, Seno, Sutopo |
| **Univ. Staff Page (UGM/ITB/UNS)** | 8 | 6 | 75% | Kuwat Triyana, Djoko Sardjadi, Tastaftiyan, Pringgo |
| **UNS SIMPEG/IRIS1103** | 4 | 4 | 100% | Pringgo, Dwiningtyas, Mufti, Baedhowi |
| **ANTARA/Tempo News Photos** | 5 | 3 | 60% | Erwin Triwanto, Gatot Hermawan, Masruri |
| **PPID/Government Sites** | 3 | 2 | 67% | Wahyu Irawan (Boyolali), Sumarno (Setda Jateng) |
| **ITB Staff Page** | 2 | 2 | 100% | Joko Suryana (STEI), Djoko Sardjadi (FTMD) |
| **Viva.co.id / News** | 4 | 3 | 75% | Sumardi, Jupri Bandang |
| **BRIN / Kementan** | 4 | 0 | 0% | Th. Dwi Suryaningrum, Bagus Sediadi, Suyitno dll |
| **YouTube/IG** | 3 | 0 | 0% | Tidak bisa extract foto profil |

### Pain Points

1. **Wikipedia 403** — Programmatic access ke Wikipedia ditolak. Perlu browser (Playwright).
2. **JS-loaded images** — News sites (ANTARA, JPNN, Liputan6) load gambar via JS. `webfetch` tidak dapat mengekstrak.
3. **Rate limiting** — `websearch` tool mulai di-rate-limit setelah ~10 queries.
4. **Name ambiguity** — Nama umum (Sutrisno, Suyitno, Hendro) susah di-disambiguasi tanpa NIDN/institusi.
5. **Dead links** — Beberapa foto ternyata 404 (Gunaryadi STP Aviasi) tanpa verifikasi otomatis.
6. **No dedup** — Orang yang sama dicari berulang di batch berbeda.

---

## 2. Source Priority Chain (per Profile Type)

Setiap tipe profil punya sumber optimal yang beda. Ikuti urutan ini:

### Academic (Dosen/Guru Besar/Peneliti)

```
Level 1: IRIS1103/SIMPEG (uns.ac.id)     ← UNS alumni
         SIMASTER (ugm.ac.id)              ← UGM alumni  
         Staff page ITB (itb.ac.id)        ← ITB alumni
Level 2: acadstaff.ugm.ac.id              ← General UGM
         feb.uns.ac.id/feb/profile/       ← UNS FEB
         ee.uii.ac.id/staff/              ← UII
Level 3: Google Scholar profile image     ← If linked
Level 4: ResearchGate profile image       ← If linked
Level 5: SINTA (sinta.kemdiktisaintek)    ← No photo usually
```

### Military/Police (TNI/Polri)

```
Level 1: Wikipedia Commons search         ← Use Playwright
Level 2: TNI AD official site             ← tniad.mil.id
         Polri official site               ← polri.go.id
Level 3: ANTARA Foto                      ← Search "nama + antaranews.com"
         Viva.co.id / Okezone / Liputan6  ← News articles with photos
Level 4: Kompas.com / Tempo.co            ← API-based photo search
```

### Government Official (Sekda/Bupati/Wamen)

```
Level 1: Wikipedia Commons                ← Use Playwright
Level 2: PPID site (ppid.{daerah}.go.id)  ← Pejabat foto
Level 3: Setda provinsi website           ← setda.jatengprov.go.id dll
Level 4: ANTARA News / Kompas             ← Pelantikan/sertijab event
```

### Business (Direktur/Pengusaha)

```
Level 1: LinkedIn profile image URL       ← Hard to extract programmatically
Level 2: Company website direksi page     ← Pertamina, Petrokimia, etc.
Level 3: News articles (Kontan, Bisnis)   ← Limited
```

---

## 3. Playwright OSINT Protocol

Gunakan Playwright MCP (`skill_mcp`) untuk kasus-kasus di bawah:

### Case A: Wikipedia 403 bypass

```
1. skill_mcp(mcp_name="playwright", tool_name="browser_navigate", arguments={url: "https://id.wikipedia.org/wiki/{Nama}"})
2. skill_mcp(mcp_name="playwright", tool_name="browser_snapshot")
   → Cari infobox image URL dari snapshot
3. Jika image ada → extract URL dari attribute src
4. Verify: HEAD request ke URL → 200 + Content-Type image/*
```

### Case B: News site JS-loaded image

```
1. browser_navigate → news article URL
2. browser_network_requests(static=true, filter="jpg|png|jpeg|webp")
   → Intercept semua image request
3. Cari yang ukurannya > 10KB (bukan icon/logo)
4. Verify image dengan HEAD request
```

### Case C: Staff profile with lazy-loaded image

```
1. browser_navigate → staff page URL
2. browser_snapshot → cari img element dengan keyword nama
3. Scroll ke element → trigger lazy load
4. browser_snapshot lagi → extract src
```

### Constraints

- Rate limit: max 1 Playwright session per 30 detik per domain
- Screenshot: hanya untuk verifikasi, jangan simpan ke file
- Timeout: 15 detik per page load

---

## 4. OSINT Agent Prompt Template

Template standar untuk setiap batch OSINT:

```
1. TASK: Search foto profil untuk N orang alumni SMA N 1 Boyolali
2. BATCH_SIZE: Maks 8 orang per batch (hindari rate limit)
3. SOURCE PRIORITY: 
   - Level 1: Wikipedia Commons (via Playwright jika 403)
   - Level 2: University staff page (SIMASTER/IRIS/staff.xxx.ac.id)
   - Level 3: Government/PPID site
   - Level 4: News articles (ANTARA, Viva, Kompas)
   - Level 5: LinkedIn/ResearchGate (last resort)
4. VERIFICATION: Setiap foto URL harus:
   - Return HTTP 200
   - Content-Type: image/*
   - Ukuran > 5KB (bukan placeholder)
5. OUTPUT FORMAT per person:
   - nama: "Nama Lengkap"
   - foto: "https://..." atau null
   - sumber: "Domain.com (halaman spesifik)"
   - confidence: "high" | "medium" | "low"
   - notes: "verified 200 OK, 120x150px, official profile photo"
6. MUST NOT: 
   - Jangan cari orang yang sudah punya foto
   - Jangan ulang search domain yang sudah 404
   - Jangan simpan screenshot ke file
7. FALLBACK: Jika level 1-5 gagal → return null + reason
```

---

## 5. Verification Workflow

Setiap foto URL harus diverifikasi sebelum ditambahkan:

```
1. HEAD request → cek HTTP status
2. Content-Type header → harus image/jpeg, image/png, image/webp
3. Content-Length → harus > 5120 bytes (5KB)
4. Jika response di-cache (CDN) → tetap valid
5. Jika redirect (301/302) → follow dan verifikasi final URL
6. Jika 403/404 → cari alternatif atau skip
```

Verification bash command:
```bash
curl -sI "https://..." | grep -E "HTTP|Content-Type|Content-Length"
```

---

## 6. Shell Script: OSINT Batch Runner

```bash
#!/bin/bash
# Script: run-osint-batch.sh
# Usage: bash run-osint-batch.sh "names.txt"

# Format names.txt: satu baris per orang
# Nama Lengkap|Alias|Angkatan|Tipe|NIDN/Institusi
# Contoh: Prof. Dr. Kuwat Triyana|Kuwat Triyana|1986|acad|NIDN UGM

BATCH_SIZE=8
INPUT_FILE="$1"
OUTPUT_DIR="osint-output"

mkdir -p "$OUTPUT_DIR"

# Split input into batches
split -l $BATCH_SIZE "$INPUT_FILE" "${OUTPUT_DIR}/batch-"

# Process each batch (parallel batch, sequential within batch)
for batch in ${OUTPUT_DIR}/batch-*; do
  basename=$(basename "$batch")
  echo "Processing $basename..."
  # Spawn explore agent for this batch
  task(
    subagent_type="explore",
    run_in_background=true,
    load_skills=[],
    description="OSINT batch ${basename}",
    prompt="
      TASK: Cari foto profil untuk alumni berikut:
      $(cat "$batch")
      
      SOURCE PRIORITY: Wikipedia > Univ Staff > Gov Site > News
      
      Untuk setiap orang:
      1. Cek Wikipedia dengan WebSearch
      2. Jika ada → extract foto URL (gunakan Playwright bypass jika 403)
      3. Cek university staff page (UGM/UNS/ITB/UNSOED)
      4. Cek government site jika tipe=gov
      5. Cek ANTARA jika tipe=mil
      
      OUTPUT FORMAT WAJIB:
      - nama, foto (URL atau null), sumber, confidence, notes
    "
  )
done

# Wait for all agents
echo "All batches launched. Wait for completion."
```

---

## 7. Quick Reference: Source URLs by Institution

| Institusi | Photo Source URL | Method |
|-----------|-----------------|--------|
| **UGM** | `acadstaff.ugm.ac.id/{username}` → SIMASTER image URL | Extract from page HTML or snapshot |
| **UNS** | `iris1103.uns.ac.id/profil-{NIDN}.asm` → simpeg.uns.ac.id/file/get?path=foto/... | NIDN from Google Scholar / SINTA |
| **ITB** | `ftmd.itb.ac.id/id/staff/{name}/` → OG:image meta tag | webfetch + grep og:image |
| **UNSOED** | `staff.unsoed.ac.id/preview/{id}.jpg` | Direct URL pattern |
| **UII** | `ee.uii.ac.id/staff/{name}/` → img src | webfetch + grep img tag |
| **Boyolali** | `ppid.boyolali.go.id/assets/images/pejabat/` | Grep known pattern |
| **Setda Jateng** | `setda.jatengprov.go.id/uploads/` | OG:image or article image |
| **Universitas Terbuka** | `nurma.staff.ut.ac.id/wp-content/uploads/` | Staff personal page |
| **Universitas Lampung** | `mih.fh.unila.ac.id/wp-content/uploads/` | Staff profile page |
| **Wikipedia** | `upload.wikimedia.org/wikipedia/commons/` | Playwright bypass |

---

## 8. Workflow Diagram

```
Input: Daftar N + Source Priority per tipe
         │
         ▼
    ┌─────────────────┐
    │   Check Existing │ ← merge_findings.js, alumni-berprestasi.html
    │   Photo DB       │
    └────────┬────────┘
             │ (already has photo → skip)
             ▼ (needs photo)
    ┌─────────────────┐
    │  Level 1: Wiki  │ ← Playwright if 403
    └────────┬────────┘
             │ (found → verify → add)
             ▼ (not found)
    ┌─────────────────┐
    │  Level 2: Univ  │ ← By institution
    └────────┬────────┘
             │ (found → verify → add)
             ▼ (not found)
    ┌─────────────────┐
    │  Level 3: Gov   │ ← PPID / Setda
    └────────┬────────┘
             │ (found → verify → add)
             ▼ (not found)
    ┌─────────────────┐
    │  Level 4: News  │ ← ANTARA / Viva / Kompas
    └────────┬────────┘
             │ (found → verify → add)
             ▼ (not found)
    ┌─────────────────┐
    │  Level 5: Other │ ← LinkedIn / RG / Last resort
    └────────┬────────┘
             ▼
    Return: null + reason
```

---

## Lessons Learned dari 49 Alumni

1. **UNS alumni paling mudah difoto** — IRIS1103/SIMPEG memberikan hit rate 100%
2. **Pensiunan Kementan/BRIN hampir tidak punya jejak foto** — 0 dari 4 ditemukan
3. **Wikipedia bagus untuk figur publik (Menteri/Jenderal)** — 5 dari 6 ditemukan
4. **Nama ambigu (Sutrisno, Suyitno, Hendro)** — butuh NIDN atau institusi spesifik
5. **Gambar ANTAra bisa diandalkan** — format URL predictable: `img.antarafoto.com/cache/...`
6. **Viva.co.id thumbnails** — format predictable: `thumb.viva.co.id/...`
7. **Jangan percaya relative path** — `images/stories/gambar/fotopagun.jpg` → sering 404
8. **OG:image meta tag adalah sumber paling reliable** — banyak site pasang foto di OG tag

---

## Lessons Learned dari Redesign (2026-05-31)

### HTML Escaping: Jangan pernah pakai inline `onerror` di template string

**Masalah:**
```javascript
// SALAH — onerror berisi HTML dengan double-quote di dalam double-quoted attribute
return `<img src="${url}" onerror="this.parentElement.innerHTML='<div class="avatar male">${char}</div>'">`;
```
Ini menghasilkan `">` visible di browser karena `"` di `class="avatar"` menutup atribut `onerror`.

**Solusi:**
```javascript
// BENAR — JS function handler, DOM method, bukan HTML string concatenation
window.handleImageError = function(imgElement, gender, name) {
  const parent = imgElement.parentElement;
  parent.innerHTML = getAvatarHtml(gender, name);
};

// Panggil di template string dengan escaped args
photoHtml = `<img src="${url}" loading="lazy" onerror="handleImageError(this, '${escapedGender}', '${escapedName}')">`;
```

Atau lebih baik lagi: set `onerror` via JS, bukan inline HTML.

### Layout Team Member Card untuk Foto Besar

Kompak top-down (64px circular photo) → side-by-side (120px photo left + info right):
- Desktop: Card flex-direction row, photo container 160px fixed, body flex:1
- Mobile (<640px): flex-direction column, photo stacks on top
- Hover: card naik 4px, shadow membesar, foto zoom 1.05x
- Hasil: foto lebih prominent, informasi lebih terbaca

**CSS Pattern:**
```css
.card { display: flex; flex-direction: row; }
.card-photo-container { width: 160px; flex-shrink: 0; }
.card-body { flex: 1; }
@media (max-width: 640px) {
  .card { flex-direction: column; }
  .card-photo-container { width: 100%; }
}
```

### CDN-First: Simpan Foto Langsung ke GitHub + jsDelivr

Setiap foto yang ditemukan saat OSINT WAJIB disimpan langsung ke CDN — **JANGAN hotlink dari sumber asli**.

Alasan:
- Sumber asli bisa 404 kapan saja (Wikipedia, universitas, news site)
- Hotlink membebani server sumber + slow load
- jsDelivr = CDN global gratis dari GitHub, load lebih cepat

Workflow:
1. Download foto dari sumber OSINT → simpan di `frontend/public/images/alumni-berprestasi/`
2. Gunakan filename: `{slugified-name}.{ext}` (lowercase, hyphens)
3. Update photoUrl di seed/DB ke: `https://cdn.jsdelivr.net/gh/camagenta/koncolawasboyolali@main/frontend/public/images/alumni-berprestasi/{slug}.{ext}`
4. Jika download gagal (404/403/0 bytes), cari sumber alternatif. Jika tidak ada, jangan featured-kan.

> ⚠️ **PENTING**: Jangan pernah menyisipkan URL sumber asli ke seed/DB. Langsung CDN atau tidak sama sekali untuk featured entries.

### Verifikasi Foto Sebelum Integrasi

Foto yang gagal load (403, 404, 0-byte) harus terdeteksi sebelum deploy:
1. `curl -sI "URL" | grep -E "HTTP|Content-Type|Content-Length"`
2. Valid: HTTP 200 + Content-Type image/* + Content-Length > 5KB
3. Jika foto dari news site (ANTARA, JPNN) mungkin return 0-byte via curl tapi OK di browser

### Git Issue-First Flow

Setiap perubahan WAJIB:
1. Buat GitHub Issue dulu
2. Kerjakan implementasi
3. Commit dengan `closes #NN`
4. Update AGENTS.md + README changelog

Ini mencegah work tanpa tracking dan memastikan semua perubahan terdokumentasi.
