/**
 * Bulk-update specific rows in a sheet from JSON.
 * Usage: node scripts/bulk-update-sheet.js <json-file>
 * 
 * JSON: { sheetName, rows: [ [col1, col2, ...], ... ] }
 * rows = full rows matching header, index determines which row to overwrite (0 = first data row)
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

async function main() {
  const jsonFile = process.argv[2];
  if (!jsonFile) { console.error('Usage: node bulk-update-sheet.js <json-file>'); process.exit(1); }

  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const { sheetName, rows } = data;

  if (!rows || rows.length === 0) { console.log('No rows to update.'); return; }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const startRow = 2; // row 1 is header
  const endRow = startRow + rows.length - 1;
  const range = `'${sheetName}'!A${startRow}:X${endRow}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });

  console.log(`✅ ${rows.length} rows updated in ${sheetName} (rows ${startRow}-${endRow})`);
}

main().catch(console.error);
