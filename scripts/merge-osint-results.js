/**
 * OSINT Agent Helper: merge findings JSON files and push to sheet.
 * Usage: node scripts/merge-osint-results.js
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

// Column indices (0-based)
const COL = {
  NO: 0, KATEGORI: 1, SUBKATEGORI: 2, JABATAN: 3, NAMA: 4,
  NAMA_FORMAL: 5, ANGKATAN: 6, TAHUN_LULUS: 7, POSISI: 8,
  RINGKASAN: 9, FOTO: 10, GENDER: 11, SUMBER: 12,
  WIKIPEDIA: 13, LINKEDIN: 14, INSTAGRAM: 15, GOOGLE_SCHOLAR: 16,
  URL_LAIN: 17, STATUS: 18, PIC: 19, TGL_RISET: 20,
  PRIORITAS: 21, KEBUTUHAN: 22, CATATAN: 23
};

async function main() {
  // Collect all findings JSONs
  const findingsDir = path.join(__dirname, '..', 'tmp', 'osint', 'findings');
  
  if (!fs.existsSync(findingsDir)) {
    console.error('No findings directory. Run agents first.');
    process.exit(1);
  }
  
  const files = fs.readdirSync(findingsDir).filter(f => f.endsWith('.json') && !f.startsWith('.'));
  console.log(`Found ${files.length} findings files`);

  // Group by sheet name
  const bySheet = {};
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(findingsDir, file), 'utf8'));
    const sheetName = data.sheetName;
    if (!bySheet[sheetName]) bySheet[sheetName] = {};
    for (const [nama, updates] of Object.entries(data.findings || {})) {
      // Normalize keys to lowercase (some agents use "Foto" vs "foto")
      const normalized = {};
      for (const [k, v] of Object.entries(updates)) {
        normalized[k.toLowerCase()] = v;
      }
      bySheet[sheetName][nama] = bySheet[sheetName][nama] || {};
      Object.assign(bySheet[sheetName][nama], normalized);
    }
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  for (const [sheetName, findings] of Object.entries(bySheet)) {
    // Read current sheet data
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A:X`,
    });
    const data = r.data.values;
    const header = data[0];
    const rows = data.slice(1);

    let updates = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nama = row[4];
      const found = findings[nama];
      if (!found) continue;

      // Helper: is auto-generated URL?
      const isAutoSearch = (url) => url && (url.includes('google.com/search') || url.includes('linkedin.com/search/results'));

      let changed = false;

      if (found.foto && !row[COL.FOTO]) { row[COL.FOTO] = found.foto; changed = true; }
      if (found.ringkasan && !row[COL.RINGKASAN]) { row[COL.RINGKASAN] = found.ringkasan; changed = true; }
      if (found.linkedin && found.linkedin.startsWith('http') && (!row[COL.LINKEDIN] || isAutoSearch(row[COL.LINKEDIN]))) { row[COL.LINKEDIN] = found.linkedin; changed = true; }
      if (found.instagram && found.instagram.startsWith('http') && !row[COL.INSTAGRAM]) { row[COL.INSTAGRAM] = found.instagram; changed = true; }
      if (found.wikipedia && found.wikipedia.startsWith('http') && (!row[COL.WIKIPEDIA] || isAutoSearch(row[COL.WIKIPEDIA]))) { row[COL.WIKIPEDIA] = found.wikipedia; changed = true; }
      if (found.gender && !row[COL.GENDER]) { row[COL.GENDER] = found.gender; changed = true; }
      if (found.sumber && !row[COL.SUMBER]) { row[COL.SUMBER] = found.sumber; changed = true; }
      if (found.posisi && !row[COL.POSISI]) { row[COL.POSISI] = found.posisi; changed = true; }
      if (found.tahunLulus && !row[COL.TAHUN_LULUS]) { row[COL.TAHUN_LULUS] = found.tahunLulus; changed = true; }
      if (found.angkatan && !row[COL.ANGKATAN]) { row[COL.ANGKATAN] = found.angkatan; changed = true; }
      if (found.urlLain && !row[COL.URL_LAIN]) { row[COL.URL_LAIN] = found.urlLain; changed = true; }

      if (changed) {
        // Recalculate prioritas
        const hasFoto = !!row[COL.FOTO];
        const hasRingkasan = !!row[COL.RINGKASAN];
        const hasLinkedIn = !!(row[COL.LINKEDIN] && !isAutoSearch(row[COL.LINKEDIN]));
        const hasInstagram = !!(row[COL.INSTAGRAM]);
        
        row[COL.PRIORITAS] = !hasFoto ? 'P1' : !hasRingkasan ? 'P2' : 'P3';
        
        const kebutuhan = [];
        if (!hasFoto) kebutuhan.push('Foto');
        if (!hasRingkasan) kebutuhan.push('Profil');
        if (!hasLinkedIn) kebutuhan.push('LinkedIn');
        if (!hasInstagram) kebutuhan.push('Instagram');
        row[COL.KEBUTUHAN] = kebutuhan.join('; ');
        
        row[COL.STATUS] = (!hasFoto || !hasRingkasan) ? '❌ Belum' : '🟡 Partial';
        row[COL.TGL_RISET] = new Date().toISOString().split('T')[0];
        
        rows[i] = row;
        updates++;
      }
    }

    if (updates > 0) {
      // Write back all rows (including header)
      const allRows = [header, ...rows];
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${sheetName}'!A1:X${allRows.length}`,
        valueInputOption: 'RAW',
        requestBody: { values: allRows },
      });
      console.log(`✅ ${sheetName}: ${updates} rows updated`);
    } else {
      console.log(`ℹ️ ${sheetName}: no changes`);
    }
  }

  console.log('Done merging OSINT results.');
}

main().catch(console.error);
