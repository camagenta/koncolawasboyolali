/**
 * Sync sheet to TypeScript — robust field patching using entry blocks.
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

const COL = { NAMA: 4, NAMA_FORMAL: 5, ANGKATAN: 6, TAHUN_LULUS: 7, POSISI: 8, RINGKASAN: 9, FOTO: 10, GENDER: 11, SUMBER: 12, LINKEDIN: 14, INSTAGRAM: 15, URL_LAIN: 17 };
const isAutoSearch = (url) => url && (url.includes('google.com/search') || url.includes('linkedin.com/search/results'));
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');

/**
 * Find entry block for a nama and return its start/end positions in content.
 */
function findEntry(content, nama) {
  const n = nama.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match from nama: line to the closing }, (accounting for nested braces)
  const idx = content.search(new RegExp(`\\n\\s*nama:\\s*['"]${n}['"]`));
  if (idx === -1) return null;

  // Find the enclosing braces
  let start = content.lastIndexOf('{', idx);
  if (start === -1) return null;

  // Find matching closing brace
  let depth = 0;
  let end = -1;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') depth--;
    if (depth === 0) { end = i + 1; break; }
  }
  if (end === -1) return null;

  return { start, end, block: content.slice(start, end) };
}

function hasField(block, field) {
  return new RegExp(`\\n\\s*${field}:\\s*'`).test(block);
}

function replaceField(block, field, value) {
  const v = esc(value);
  const re = new RegExp(`(\\n\\s*)${field}:\\s*'(?:[^'\\\\]|\\\\.)*'\\s*,?`);
  return block.replace(re, `$1${field}: '${v}',`);
}

function addField(block, field, value) {
  const v = esc(value);
  const indentMatch = block.match(/\n(\s*)\w+:/);
  const indent = indentMatch ? indentMatch[1] : '  ';
  // Find the last line with content (before closing brace)
  // Then insert a comma after it if missing, then add new field and closing
  return block.replace(/\n(\s*)\}$/, (match, ws) => {
    // Check if last line (before \n  }) already ends with comma
    const lines = block.split('\n');
    const lastLine = lines.filter(l => l.trim()).slice(-1)[0] || '';
    const hasComma = lastLine.trim().endsWith(',');
    // The match is \n  } — we need to insert before it
    return `${hasComma ? '' : ','}\n${indent}${field}: '${v}',\n${ws}}`;
  });
}

function replaceOrAddKontak(block, subfield, value) {
  const v = esc(value);
  const kontakRe = /kontak:\s*\{\s*([^}]*)\s*\}/;
  const m = block.match(kontakRe);
  if (m) {
    const inner = m[1].trim();
    const subRe = new RegExp(`${subfield}:\\s*'(?:[^'\\\\]|\\\\.)*'`);
    let newInner;
    if (inner.match(subRe)) {
      newInner = inner.replace(subRe, `${subfield}: '${v}'`);
    } else {
      newInner = inner ? inner + ', ' + `${subfield}: '${v}'` : `${subfield}: '${v}'`;
    }
    return block.replace(kontakRe, `kontak: { ${newInner} }`);
  }
  const indentMatch = block.match(/\n(\s*)\w+:/);
  const indent = indentMatch ? indentMatch[1] : '  ';
  return block.replace(/\n(\s*)\}$/, (match, ws) => {
    const lines = block.split('\n');
    const lastLine = lines.filter(l => l.trim()).slice(-1)[0] || '';
    const hasComma = lastLine.trim().endsWith(',');
    return `${hasComma ? '' : ','}\n${indent}kontak: { ${subfield}: '${v}' },\n${ws}}`;
  });
}

function patch(content, nama, field, getValue) {
  const entry = findEntry(content, nama);
  if (!entry) return content;

  const value = getValue();
  if (!value) return content;

  let newBlock;
  if (field === 'kontak') {
    const [sub, v] = value;
    newBlock = replaceOrAddKontak(entry.block, sub, v);
  } else if (hasField(entry.block, field)) {
    newBlock = replaceField(entry.block, field, value);
  } else {
    newBlock = addField(entry.block, field, value);
  }

  if (newBlock === entry.block) return content;
  return content.slice(0, entry.start) + newBlock + content.slice(entry.end);
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // BARU
  console.log('=== PENGURUS BARU ===');
  const baruSheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID, range: "'PENGURUS BARU'!A:X",
  });
  const baruRows = baruSheet.data.values.slice(1);
  const baruTS = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'profil-pengurus.ts');
  let c = fs.readFileSync(baruTS, 'utf8');

  for (const row of baruRows) {
    const n = row[COL.NAMA]; if (!n) continue;
    c = patch(c, n, 'foto', () => (row[COL.FOTO] && row[COL.FOTO].startsWith('http') && !row[COL.FOTO].includes('google.com/search')) ? row[COL.FOTO] : null);
    c = patch(c, n, 'ringkasan', () => (row[COL.RINGKASAN] && row[COL.RINGKASAN].length > 10 && !row[COL.RINGKASAN].includes('Tidak ditemukan')) ? row[COL.RINGKASAN] : null);
    c = patch(c, n, 'gender', () => row[COL.GENDER] || null);
    c = patch(c, n, 'sumber', () => (row[COL.SUMBER] && row[COL.SUMBER].length > 3) ? row[COL.SUMBER] : null);
    c = patch(c, n, 'posisi', () => (row[COL.POSISI] && row[COL.POSISI].length > 3) ? row[COL.POSISI] : null);
    if (row[COL.LINKEDIN] && row[COL.LINKEDIN].startsWith('http') && !isAutoSearch(row[COL.LINKEDIN]))
      c = patch(c, n, 'kontak', () => ['linkedin', row[COL.LINKEDIN]]);
    if (row[COL.INSTAGRAM] && row[COL.INSTAGRAM].startsWith('http'))
      c = patch(c, n, 'kontak', () => ['instagram', row[COL.INSTAGRAM]]);
  }
  fs.writeFileSync(baruTS, c);
  const bCount = (c.match(/\n\s*nama:\s*'/g) || []).length;
  console.log(`  Written. Entries: ${bCount}`);

  // LAMA
  console.log('\n=== PENGURUS LAMA ===');
  const lamaSheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID, range: "'PENGURUS LAMA'!A:X",
  });
  const lamaRows = lamaSheet.data.values.slice(1);
  const lamaTS = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'profil-pengurus-lama.ts');
  c = fs.readFileSync(lamaTS, 'utf8');

  for (const row of lamaRows) {
    const n = row[COL.NAMA]; if (!n) continue;
    c = patch(c, n, 'foto', () => (row[COL.FOTO] && row[COL.FOTO].startsWith('http') && !row[COL.FOTO].includes('google.com/search')) ? row[COL.FOTO] : null);
    c = patch(c, n, 'ringkasan', () => (row[COL.RINGKASAN] && row[COL.RINGKASAN].length > 10 && !row[COL.RINGKASAN].includes('Tidak ditemukan')) ? row[COL.RINGKASAN] : null);
    c = patch(c, n, 'posisi', () => (row[COL.POSISI] && row[COL.POSISI].length > 3) ? row[COL.POSISI] : null);
  }
  fs.writeFileSync(lamaTS, c);
  const lCount = (c.match(/\n\s*nama:\s*'/g) || []).length;
  console.log(`  Written. Entries: ${lCount}`);

  console.log('\nDone!');
}

main().catch(console.error);
