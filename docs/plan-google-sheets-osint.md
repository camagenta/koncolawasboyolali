# PLAN — Google Sheets Master Data untuk Profil Pengurus IKA 2022–2025

## Link Sheet
https://docs.google.com/spreadsheets/d/1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M/edit?gid=705796150#gid=705796150

## Target
Buat tab baru bernama `PENGURUS LAMA` (atau `PENGURUS 2022-2025`) di sheet yang sama dengan `DATAPENGURUS` (current period).

---

## 1. Struktur Kolom (22 Kolom)

### Identitas & Kategori
| Kolom | Header | Contoh | Fungsi |
|-------|--------|--------|--------|
| A | No | 1 | Auto-increment |
| B | Kategori | Dewan Pembina | Filter grouping |
| C | Subkategori | Pimpinan | Hanya untuk Pengurus Pusat |
| D | Jabatan | Ketua Dewan Pembina | Dari SK |
| E | Nama Lengkap | Seno Kusumoarjo | Nama sesuai SK |
| F | Angkatan | A-79 | Filter angkatan |

### Data Profil
| Kolom | Header | Contoh | Fungsi |
|-------|--------|--------|--------|
| G | Posisi / Jabatan Terakhir | Arsitek Politik PDIP Boyolali | Ringkas (max 1 line) |
| H | Ringkasan / Rekam Jejak | Tokoh senior PDIP Boyolali... | 2-3 paragraf |
| I | URL Foto | https://upload.wikimedia.org/... | Direct image link |
| J | Validasi Foto | ✅ / ❌ | Cek link masih hidup |
| K | URL Wikipedia | https://id.wikipedia.org/... | Sumber utama |

### Media Sosial & Sumber
| Kolom | Header | Contoh | Fungsi |
|-------|--------|--------|--------|
| L | URL LinkedIn | https://linkedin.com/in/... | Profesional |
| M | URL Instagram | https://instagram.com/... | Personal |
| N | URL Facebook | https://facebook.com/... | Alternatif |
| O | URL Google Scholar | https://scholar.google.com/... | Akademisi |
| P | URL Sumber Lain | https://antaranews.com/... | Berita / portal |

### Status & Workflow
| Kolom | Header | Contoh | Fungsi |
|-------|--------|--------|--------|
| Q | Status OSINT | ✅ Terverifikasi / 🟡 Partial / ❌ Tidak ditemukan | Progress tracking |
| R | PIC | @seno | Penanggung jawab riset |
| S | Tgl Riset | 30/05/2026 | Last update |
| T | Prioritas | P1 / P2 / P3 | P1 = butuh foto, P2 = butuh profil, P3 = lengkap |
| U | Kebutuhan | Foto + LinkedIn + Wikipedia | Action items |
| V | Catatan Internal | Nama ambigu, butuh konfirmasi | Internal notes |

---

## 2. Isi Data Awal (70 Baris)

Data TypeScript `profil-pengurus-lama.ts` → CSV → import ke Google Sheets.

Mapping:
```
nama              → Kolom E (Nama Lengkap)
jabatan           → Kolom D (Jabatan)
kategori          → Kolom B (Kategori)
subkategori       → Kolom C (Subkategori)
angkatan          → Kolom F (Angkatan)
posisi            → Kolom G (Posisi)
foto              → Kolom I (URL Foto)
ringkasan         → Kolom H (Ringkasan)
```

Semua status awal → `🟡 Partial` (karena OSINT sudah jalan untuk 19 dari 70).

---

## 3. Google Apps Script — Automation Tools

Buka **Extensions > Apps Script** di Google Sheet, paste script berikut:

### 3a. Generate Search URLs Otomatis
```javascript
function generateSearchURLs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PENGURUS LAMA');
  const range = sheet.getDataRange();
  const values = range.getValues();

  for (let i = 1; i < values.length; i++) { // skip header
    const nama = values[i][4]; // Kolom E
    if (!nama) continue;

    const encoded = encodeURIComponent(nama);
    values[i][10] = `https://www.google.com/search?q=${encoded}+site:id.wikipedia.org`;
    values[i][11] = `https://www.linkedin.com/search/results/all/?keywords=${encoded}`;
    values[i][14] = `https://www.google.com/search?q=${encoded}+profil+biografi`;
  }

  range.setValues(values);
}
```

### 3b. Validasi Foto URL (Bulk Check)
```javascript
function validatePhotoURLs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PENGURUS LAMA');
  const range = sheet.getDataRange();
  const values = range.getValues();

  for (let i = 1; i < values.length; i++) {
    const url = values[i][8]; // Kolom I
    if (!url) {
      values[i][9] = '⏳';
      continue;
    }
    try {
      const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      values[i][9] = response.getResponseCode() === 200 ? '✅' : '❌ ' + response.getResponseCode();
    } catch (e) {
      values[i][9] = '❌ Error';
    }
  }

  range.setValues(values);
}
```

### 3c. Export ke JSON (untuk update kode frontend)
```javascript
function exportToJSON() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PENGURUS LAMA');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const json = [];

  for (let i = 1; i < data.length; i++) {
    const obj = {
      nama: data[i][4],
      namaLengkap: data[i][4],
      jabatan: data[i][3],
      kategori: data[i][1].toLowerCase().replace(/\s+/g, '-'),
      subkategori: data[i][2],
      angkatan: data[i][5],
      posisi: data[i][6],
      foto: data[i][8],
      ringkasan: data[i][7]
    };
    json.push(obj);
  }

  const jsonStr = JSON.stringify(json, null, 2);

  // Create a new sheet with the JSON output
  const jsonSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('JSON_EXPORT');
  jsonSheet.getRange('A1').setValue(jsonStr);
  jsonSheet.setColumnWidth(1, 800);

  SpreadsheetApp.getUi().alert('Exported ' + json.length + ' entries to JSON_EXPORT sheet');
}
```

---

## 4. Speed-up Possibilities

### Level 1: Manual Assisted (hari ini)
✅ Generate search URLs untuk semua 70 nama → satu klik  
✅ Validasi foto URL langsung dari Sheet  
✅ Filter by status untuk prioritaskan yang belum selesai  

### Level 2: Semi-Automated (1-2 hari)
🤖 **OSINT Agent per kategori** — deploy 4 agent paralel (Pembina/Penasehat/Pakar/Pusat)  
🤖 **Bulk Wikipedia scraping** — cek apakah nama ada di Wikipedia  
🤖 **Auto PIC assignment** — bagi tugas ke 4 agent berdasarkan kategori  

### Level 3: Full Pipeline (3-5 hari)
🔄 **Google Sheet → JSON API** — bikin endpoint `/api/profiles/master` baca dari Sheet  
🔄 **Auto-update frontend** — setiap perubahan di Sheet otomatis update card  
🔄 **Webhook** — pas foto diverifikasi, otomatis push ke git  

### Tools yang Bisa Diparalelkan

| Agent | Tugas | Tools |
|-------|-------|-------|
| Agent 1 | Wikipedia & portal berita (20 figur publik) | WebSearch + WebFetch |
| Agent 2 | LinkedIn & profil profesional (20 figur) | WebSearch + LinkedIn |
| Agent 3 | Akademisi & Google Scholar (15 figur) | Google Scholar, SINTA |
| Agent 4 | Media sosial & foto (sisanya) | Instagram, FB, Google Images |

---

## 5. Quick Start

1. Buka https://docs.google.com/spreadsheets/d/1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M/edit
2. Buat tab baru: **PENGURUS LAMA**
3. Paste header row dari section 1
4. Import CSV data dari `scripts/export-pengurus-lama.csv` (akan digenerate)
5. Jalankan Apps Script `generateSearchURLs()`
6. Assign PIC per kategori (4 orang/agent)
7. Mulai riset paralel per agent

---

## 6. Todo (Masuk ke Git)

- [x] Desain struktur sheet
- [ ] Generate CSV dari data TypeScript → export ke Sheet
- [ ] Buat tab PENGURUS LAMA di Google Sheet
- [ ] Jalankan Apps Script automation
- [ ] Assign 4 agent OSINT paralel per kategori
- [ ] Update profil-pengurus-lama.ts setelah riset selesai
- [ ] Dokumentasi workflow di AGENTS.md
