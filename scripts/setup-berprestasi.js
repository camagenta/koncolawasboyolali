const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

async function main() {
  if (!fs.existsSync(KEY_PATH)) { console.error('No credentials'); process.exit(1); }
  
  // 1. Fetch issue body
  const issueBody = execSync('gh issue view 45 --repo camagenta/koncolawasboyolali --json body -q .body').toString();
  
  // 2. Parse numbered list (1 to 49)
  const lines = issueBody.split('\n');
  const items = [];
  let currentItem = null;
  
  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.*)/);
    if (match) {
      if (currentItem) items.push(currentItem);
      currentItem = { no: parseInt(match[1]), text: match[2].trim() };
    } else if (currentItem && line.trim() && !line.startsWith('Catatan:') && !line.match(/^\d+ sd/)) {
      if (!line.includes('Informan no') && !line.match(/^\d+(?:,\d+)* info dari/)) {
         currentItem.text += ' ' + line.trim();
      }
    }
  }
  if (currentItem) items.push(currentItem);
  
  console.log(`Parsed ${items.length} items from issue 45.`);

  // 3. Format into rows
  const headers = [
    'No', 'Kategori', 'Subkategori', 'Jabatan', 'Nama Lengkap', 'Nama Formal', 
    'Angkatan', 'Tahun Lulus', 'Posisi / Jabatan Terakhir', 'Ringkasan / Rekam Jejak', 
    'URL Foto', 'Gender', 'Sumber', 'URL Wikipedia', 'URL LinkedIn', 'URL Instagram', 
    'URL Google Scholar', 'URL Lain / Email', 'Status OSINT', 'PIC', 'Tgl Riset', 
    'Prioritas', 'Kebutuhan', 'Catatan Internal'
  ];

  const rows = items.map((item, idx) => {
    // Basic extraction attempt for angkatan/lulusan
    let lulusan = '';
    const lulusMatch = item.text.match(/(?:lulus|lulusan|alumni)(?:\s+SMA)?(?:\s+Bi)?(?:\s+th|\s+tahun)?\s*(19\d{2}|20\d{2}|\d{2})/i);
    if (lulusMatch) {
       lulusan = lulusMatch[1];
       if (lulusan.length === 2) lulusan = (parseInt(lulusan) > 50 ? '19' : '20') + lulusan;
    }
    
    // Angkatan parsing (A-XX or angkatan)
    let angkatan = '';
    const aMatch = item.text.match(/A[ \-']?(\d{2})/i);
    if (aMatch) {
       angkatan = (parseInt(aMatch[1]) > 50 ? '19' : '20') + aMatch[1];
       if (!lulusan) lulusan = (parseInt(angkatan) + 3).toString(); // Rough estimate
    }

    // Name extraction - just take the first part before comma or parenthesis as a rough guess
    let nama = item.text.split(/[,(]/)[0].trim();
    if (nama.toLowerCase().includes('almarhum')) nama = nama.replace(/almarhum/i, '').trim();
    
    return [
      item.no,
      'Alumni Berprestasi', // Kategori
      '', // Subkategori
      '', // Jabatan
      '', // Nama Lengkap
      nama, // Nama Formal (rough parse)
      angkatan, // Angkatan
      lulusan, // Tahun Lulus
      '', // Posisi / Jabatan Terakhir
      item.text, // Ringkasan / Rekam Jejak
      '', // URL Foto
      '', // Gender
      'Issue #45 Github', // Sumber
      '', '', '', '', '', 
      'TODO', // Status OSINT
      '', // PIC
      '', // Tgl Riset
      'P1', // Prioritas
      'Verifikasi Nama, Jabatan, Foto, LinkedIn', // Kebutuhan
      '' // Catatan Internal
    ];
  });

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  
  // 4. Create sheet if not exists
  const SHEET_NAME = 'ALUMNI BERPRESTASI';
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    if (!meta.data.sheets.find(s => s.properties.title === SHEET_NAME)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: { properties: { title: SHEET_NAME } }
          }]
        }
      });
      console.log(`Created sheet ${SHEET_NAME}`);
    } else {
      console.log(`Sheet ${SHEET_NAME} already exists`);
    }
    
    // Clear and Write Data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:X`
    });
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows]
      }
    });
    console.log(`Successfully wrote ${rows.length} rows to ${SHEET_NAME}`);
    
    // Split into chunks for OSINT agents
    const outDir = path.join(__dirname, '..', 'tmp', 'osint_berprestasi');
    fs.mkdirSync(outDir, { recursive: true });
    
    // Chunk size 10 (so about 5 chunks for 49 items)
    const chunkSize = 10;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize).map(r => ({
        no: r[0],
        nama_formal: r[5],
        angkatan_lulus: `Angkatan ${r[6]} / Lulus ${r[7]}`,
        ringkasan_awal: r[9]
      }));
      fs.writeFileSync(
        path.join(outDir, `chunk_${Math.floor(i/chunkSize)+1}.json`), 
        JSON.stringify(chunk, null, 2)
      );
    }
    console.log(`Created ${Math.ceil(rows.length/chunkSize)} JSON chunks in tmp/osint_berprestasi`);

  } catch (err) {
    console.error(err);
  }
}
main();
