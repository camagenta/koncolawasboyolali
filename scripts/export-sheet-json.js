/**
 * Read sheet data and save as JSON per category
 * Usage: node scripts/export-sheet-json.js
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');
const OUT_DIR = path.join(__dirname, '..', 'tmp', 'osint');

async function main() {
  if (!fs.existsSync(KEY_PATH)) { console.error('No credentials'); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  for (const sheetName of ['PENGURUS LAMA', 'PENGURUS BARU']) {
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A:X`,
    });
    const data = r.data.values;
    const header = data[0];
    const rows = data.slice(1);

    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const s = meta.data.sheets.find(s => s.properties.title === sheetName);
    const sheetId = s.properties.sheetId;

    // Group by kategori (col index 1)
    const byKategori = {};
    for (const row of rows) {
      const kat = row[1] || 'Unknown';
      if (!byKategori[kat]) byKategori[kat] = [];
      byKategori[kat].push(row);
    }

    // Save full data
    fs.writeFileSync(path.join(OUT_DIR, `${sheetName.replace(/ /g, '_')}_full.json`), JSON.stringify({ header, rows, sheetId }, null, 2));

    // Save per-category files
    for (const [kat, katRows] of Object.entries(byKategori)) {
      const safeName = `${sheetName.replace(/ /g, '_')}_${kat.replace(/ /g, '_')}.json`;
      fs.writeFileSync(path.join(OUT_DIR, safeName), JSON.stringify({ header, rows: katRows, sheetId }, null, 2));
      console.log(`${sheetName} / ${kat}: ${katRows.length} profil -> ${safeName}`);
    }
  }

  console.log('Done. Files in', OUT_DIR);
}

main().catch(console.error);
