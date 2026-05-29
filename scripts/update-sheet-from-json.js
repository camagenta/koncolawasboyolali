/**
 * Update sheet rows from JSON findings.
 * Usage: node scripts/update-sheet-from-json.js <json-file>
 * 
 * JSON format: { sheetName, sheetId, header, updates: [ { rowIndex, colIndex, value } ] }
 * rowIndex is 0-based (0 = first data row), colIndex is 0-based
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

async function main() {
  const jsonFile = process.argv[2];
  if (!jsonFile) { console.error('Usage: node update-sheet-from-json.js <json-file>'); process.exit(1); }

  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const { sheetName, sheetId, updates } = data;

  if (!updates || updates.length === 0) { console.log('No updates.'); return; }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Batch update cells
  const requests = [];
  const colLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (const u of updates) {
    const colLetter = colLetters[u.colIndex];
    const sheetRow = u.rowIndex + 2; // +1 for header, +1 for 1-indexed
    const range = `'${sheetName}'!${colLetter}${sheetRow}:${colLetter}${sheetRow}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [[u.value]] },
    });
  }

  console.log(`✅ ${updates.length} cell updates applied to ${sheetName}`);
}

main().catch(console.error);
