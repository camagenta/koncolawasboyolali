/**
 * Google Sheets API — Direct Write Script
 * 
 * Push data profil pengurus lama langsung ke Google Sheet via API.
 * 
 * Setup:
 * 1. Buka https://console.cloud.google.com/
 * 2. Buat project baru → Enable Google Sheets API
 * 3. Credentials → Create Service Account → Download JSON key
 *    → simpan sebagai scripts/gcp-service-account.json
 * 4. Share spreadsheet dengan service account email (Viewer/Editor)
 * 5. Jalankan: npm install googleapis
 * 6. node scripts/push-to-sheet.js
 */

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// ===== CONFIG =====
const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const SHEET_NAME = 'PENGURUS LAMA';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');
// ==================

async function main() {
  // 1. Auth
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`❌ File kredensial tidak ditemukan: ${KEY_PATH}`);
    console.error('   Buat service account di GCP Console, download JSON, simpan di sini.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // 2. Read CSV / TS data
  const tsPath = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'profil-pengurus-lama.ts');
  const content = fs.readFileSync(tsPath, 'utf8');

  // Simple extraction of the array
  const profiles = extractProfiles(content);

  // 3. Build rows
  const kategoriMap = {
    'dewan-pembina': 'Dewan Pembina',
    'dewan-penasehat': 'Dewan Penasehat',
    'dewan-pakar': 'Dewan Pakar',
    'pengurus-pusat': 'Pengurus Pusat',
  };

  const headerRow = [
    'No', 'Kategori', 'Subkategori', 'Jabatan', 'Nama Lengkap', 'Angkatan',
    'Posisi / Jabatan Terakhir', 'Ringkasan / Rekam Jejak', 'URL Foto',
    'URL Wikipedia', 'URL LinkedIn', 'URL Instagram', 'URL Google Scholar',
    'URL Sumber Lain', 'Status OSINT', 'PIC', 'Tgl Riset', 'Prioritas',
    'Kebutuhan', 'Catatan Internal'
  ];

  const rows = [headerRow];

  profiles.forEach((p, i) => {
    const needsPhoto = !p.foto;
    const needsRingkasan = !p.ringkasan;
    const prioritas = !p.foto ? 'P1' : !p.ringkasan ? 'P2' : 'P3';
    const kebutuhan = [];
    if (needsPhoto) kebutuhan.push('Foto');
    if (needsRingkasan) kebutuhan.push('Profil');
    kebutuhan.push('LinkedIn');
    kebutuhan.push('Wikipedia');
    const status = (!p.foto || !p.ringkasan) ? '❌ Belum' : '🟡 Partial';

    rows.push([
      i + 1,
      kategoriMap[p.kategori] || p.kategori,
      p.subkategori || '',
      p.jabatan || '',
      p.nama || '',
      p.angkatan || '',
      p.posisi || '',
      (p.ringkasan || '').replace(/\n/g, ' ').replace(/,/g, ';'),
      p.foto || '',
      `https://www.google.com/search?q=${encodeURIComponent(p.nama)}+site:id.wikipedia.org`,
      `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(p.nama)}`,
      '',
      '',
      '',
      status,
      '',
      '',
      prioritas,
      kebutuhan.join('; '),
      '',
    ]);
  });

  // 4. Clear existing sheet content and write new data
  try {
    // Try to clear existing sheet first
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:T`,
    });
  } catch (e) {
    // Sheet might not exist yet — create it
    console.log('Sheet belum ada, membuat baru...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: {
            properties: { title: SHEET_NAME }
          }
        }]
      }
    });
  }

  // 5. Write data
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAME}'!A1:T${rows.length}`,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });

  console.log(`✅ Sukses! ${profiles.length} profil ditulis ke sheet "${SHEET_NAME}"`);

  // 6. Auto-format: freeze header, bold, resize
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
              }
            },
            fields: 'userEnteredFormat(textFormat,backgroundColor)',
          }
        },
        {
          updateSheetProperties: {
            properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } },
            fields: 'gridProperties.frozenRowCount',
          }
        }
      ]
    }
  });

  console.log('✅ Formatting applied: bold header + frozen row');
}

// Helper: simple JS object extraction from TS file
function extractProfiles(tsContent) {
  const results = [];
  const lines = tsContent.split('\n');
  let current = null;
  let inArray = false;

  for (const line of lines) {
    const t = line.trim();

    if (t.includes('profilesLama: ProfileLama[] = [')) {
      inArray = true;
      continue;
    }
    if (!inArray) continue;
    if (t === ']' || t.startsWith('//')) continue;

    if (t === '{') {
      current = {};
    } else if (t === '},' || t === '}') {
      if (current && current.nama) results.push(current);
      current = null;
    } else if (current) {
      const m = t.match(/^(\w+):\s*(.+),?$/);
      if (m) {
        let val = m[2].trim();
        if (val.endsWith(',')) val = val.slice(0, -1);
        val = val.replace(/\s*\/\/.*$/, '');
        if ((val.startsWith("'") && val.endsWith("'")) ||
            (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        }
        current[m[1]] = val;
      }
    }
  }
  return results;
}

main().catch(console.error);
