const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const SHEET_NAME = 'PENGURUS BARU';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

const HEADER = [
  'No', 'Kategori', 'Subkategori', 'Jabatan', 'Nama Lengkap',
  'Nama Formal', 'Angkatan', 'Tahun Lulus',
  'Posisi / Jabatan Terakhir', 'Ringkasan / Rekam Jejak', 'URL Foto',
  'Gender', 'Sumber',
  'URL Wikipedia', 'URL LinkedIn', 'URL Instagram', 'URL Google Scholar',
  'URL Lain / Email',
  'Status OSINT', 'PIC', 'Tgl Riset', 'Prioritas', 'Kebutuhan', 'Catatan Internal'
];

const KATEGORI_MAP = {
  'dewan-pembina': 'Dewan Pembina',
  'dewan-pengawas': 'Dewan Pengawas',
  'pengurus-pusat': 'Pengurus Pusat',
  'bidang': 'Bidang',
};

async function main() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`File kredensial tidak ditemukan: ${KEY_PATH}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const tsPath = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'profil-pengurus.ts');
  const content = fs.readFileSync(tsPath, 'utf8');
  const profiles = extractProfiles(content);

  const rows = [HEADER];

  profiles.forEach((p, i) => {
    const needsPhoto = !p.foto;
    const needsRingkasan = !p.ringkasan;
    const prioritas = !p.foto ? 'P1' : !p.ringkasan ? 'P2' : 'P3';
    const kebutuhan = [];
    if (needsPhoto) kebutuhan.push('Foto');
    if (needsRingkasan) kebutuhan.push('Profil');
    if (!p.kontak?.linkedin) kebutuhan.push('LinkedIn');
    if (!p.kontak?.instagram) kebutuhan.push('Instagram');
    const status = (!p.foto || !p.ringkasan || (p.kontak && !p.kontak.linkedin)) ? '❌ Belum' : '🟡 Partial';

    rows.push([
      i + 1,
      KATEGORI_MAP[p.kategori] || p.kategori,
      '',
      p.jabatan || '',
      p.nama || '',
      p.namaLengkap || '',
      p.estimasiAngkatan || '',
      p.tahunLulus || '',
      p.posisi || '',
      (p.ringkasan || '').replace(/\n/g, ' ').replace(/,/g, ';'),
      p.foto || '',
      p.gender || '',
      p.sumber || '',
      `https://www.google.com/search?q=${encodeURIComponent(p.nama)}+site:id.wikipedia.org`,
      p.kontak?.linkedin || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(p.nama)}`,
      p.kontak?.instagram || '',
      '',
      p.kontak?.email || '',
      status,
      '',
      '',
      prioritas,
      kebutuhan.join('; '),
      '',
    ]);
  });

  // Clear or create sheet
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:X`,
    });
  } catch (e) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }]
      }
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET_NAME}'!A1:X${rows.length}`,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });

  console.log(`Sukses! ${profiles.length} profil ditulis ke sheet "${SHEET_NAME}"`);

  // Format
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const s = meta.data.sheets.find(s => s.properties.title === SHEET_NAME);
  const sheetId = s.properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
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
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: 'gridProperties.frozenRowCount',
          }
        }
      ]
    }
  });

  console.log('Formatting applied: bold header + frozen row');
}

function extractProfiles(tsContent) {
  const results = [];
  const lines = tsContent.split('\n');
  let current = null;
  let inArray = false;

  for (const line of lines) {
    const t = line.trim();
    if (t.includes('profiles: Profile[] = [')) { inArray = true; continue; }
    if (!inArray) continue;
    if (t.startsWith('//') || t === ']' || t === '];') continue;

    if (t === '{') { current = {}; continue; }
    if (t === '},' || t === '}') {
      if (current && current.nama) results.push(current);
      current = null;
      continue;
    }

    if (current) {
      const m = t.match(/^(\w+):\s*(.+),?$/);
      if (m) {
        let key = m[1];
        let val = m[2].trim();
        if (val.endsWith(',')) val = val.slice(0, -1);
        val = val.replace(/\s*\/\/.*$/, '').trim();

        // inline object: kontak: { linkedin: '...', instagram: '...' }
        const inlineObj = val.match(/^{(.+)}$/);
        if (inlineObj) {
          const inner = inlineObj[1];
          const obj = {};
          const pairs = inner.split(',').map(s => s.trim()).filter(Boolean);
          for (const pair of pairs) {
            const [k, ...v] = pair.split(':').map(s => s.trim());
            let vv = v.join(':').trim();
            if ((vv.startsWith("'") && vv.endsWith("'")) || (vv.startsWith('"') && vv.endsWith('"'))) {
              vv = vv.slice(1, -1);
            }
            obj[k] = vv;
          }
          current[key] = obj;
          continue;
        }

        if ((val.startsWith("'") && val.endsWith("'")) ||
            (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        }
        current[key] = val;
      }
    }
  }
  return results;
}

main().catch(console.error);
