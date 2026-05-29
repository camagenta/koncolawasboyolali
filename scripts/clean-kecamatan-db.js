const mysql = require('mysql2/promise');

const KECAMATAN_BOYOLALI = new Set([
  'Ampel', 'Andong', 'Banyudono', 'Boyolali', 'Cepogo', 'Gladagsari',
  'Juwangi', 'Karanggede', 'Kemusu', 'Klego', 'Mojosongo', 'Musuk',
  'Ngemplak', 'Nogosari', 'Sambi', 'Sawit', 'Selo', 'Simo',
  'Tamansari', 'Teras', 'Wonosamodro', 'Wonosegoro'
]);

const VILLAGE_TO_KECAMATAN = {
  'banaran': 'Boyolali',
  'pulisen': 'Boyolali',
  'siswodipuran': 'Boyolali',
  'surodadi': 'Boyolali',
  'kragilan': 'Mojosongo',
  'karanggeneng': 'Banyudono',
  'sonolayu': 'Banyudono',
  'randussri': 'Sambi',
  'dawung': 'Boyolali',
  'kiringan': 'Banyudono',
  'poncobudoyo': 'Boyolali',
};

const MANUAL_OVERRIDE = {
  'konoha': '',
  'nggone gado gado uplik': '',
  'sonolayu ngidul pokoke': '',
  'jalan imogiri barat km 7, gandok, bangunharjo, seqon': '',
  'kecamatan kaliwungu, semarang': '',
  'kec.gatak': '',
  'selo - banyudono': 'Selo',
  'ampel (sekarang jadi gladagsari)': 'Gladagsari',
  'sidotopo,mliwis,cepogo,byl 19/iii': 'Cepogo',
  'jl. cendana no.4 winong baru boyolali': 'Boyolali',
  'jl mulwo no 6 01/14 surodadi siswodipuran boyolali': 'Boyolali',
};

function normalize(orig) {
  if (!orig || !orig.trim()) return '';

  const lower = orig.trim().toLowerCase().replace(/\s+/g, ' ');

  if (MANUAL_OVERRIDE[lower]) return MANUAL_OVERRIDE[lower];

  let cleaned = orig.trim().replace(/^(Kec\.|Kecamatan|Kec)\s+/i, '').trim();
  cleaned = cleaned.replace(/\s+Kota$/i, '').trim();
  cleaned = cleaned.replace(/[, ]+Boyolali$/i, '').trim();
  cleaned = cleaned.replace(/^Boyolali\s+/i, '').replace(/\s+Boyolali$/i, '').trim();

  if (KECAMATAN_BOYOLALI.has(cleaned)) return cleaned;

  for (const k of KECAMATAN_BOYOLALI) {
    if (cleaned.toLowerCase() === k.toLowerCase()) return k;
  }

  cleaned = cleaned.replace(/\s+boyolali$/i, '').trim();
  for (const k of KECAMATAN_BOYOLALI) {
    if (cleaned.toLowerCase() === k.toLowerCase()) return k;
  }

  const firstWord = cleaned.split(/[\s,]+/)[0].toLowerCase();
  if (VILLAGE_TO_KECAMATAN[firstWord]) return VILLAGE_TO_KECAMATAN[firstWord];

  for (const k of KECAMATAN_BOYOLALI) {
    if (lower.includes(k.toLowerCase())) return k;
  }

  for (const [village, kec] of Object.entries(VILLAGE_TO_KECAMATAN)) {
    if (lower.includes(village)) return kec;
  }

  return '';
}

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'koncolawas',
    password: 'bismillah',
    database: 'koncolawas',
  });

  const [rows] = await conn.execute(
    'SELECT id, nama_lengkap, kecamatan_asal_boyolali, tahun_masuk FROM alumni_profiles ORDER BY id'
  );

  console.log('Total:', rows.length);

  const changes = [];
  const stats = { unchanged: 0, fixed: 0, emptied: 0 };

  for (const row of rows) {
    const orig = row.kecamatan_asal_boyolali || '';
    const corrected = normalize(orig);

    if (corrected !== orig) {
      if (!corrected) {
        stats.emptied++;
      } else {
        stats.fixed++;
      }
      changes.push({ id: row.id, name: row.nama_lengkap || '', before: orig, after: corrected || '' });
    } else {
      stats.unchanged++;
    }
  }

  console.log(`Stats: ${stats.unchanged} unchanged, ${stats.fixed} fixed, ${stats.emptied} emptied`);
  console.log('\n=== Changes ===');
  for (const c of changes) {
    console.log(`${(c.name||'').padEnd(30)} | "${(c.before||'').padEnd(35)}" → "${c.after||'(empty)'}"`);
  }

  console.log('\n=== Applying Updates ===');
  for (const c of changes) {
    await conn.execute(
      'UPDATE alumni_profiles SET kecamatan_asal_boyolali = ? WHERE id = ?',
      [c.after, c.id]
    );
    console.log(`✓ ${c.name}: "${c.before}" → "${c.after || '(empty)'}"`);
  }

  await conn.end();

  console.log('\n=== Verification ===');
  const conn2 = await mysql.createConnection({
    host: 'localhost',
    user: 'koncolawas',
    password: 'bismillah',
    database: 'koncolawas',
  });
  const [verification] = await conn2.execute(
    'SELECT kecamatan_asal_boyolali, COUNT(*) as cnt FROM alumni_profiles GROUP BY kecamatan_asal_boyolali ORDER BY cnt DESC'
  );
  for (const v of verification) {
    console.log(`  ${(v.kecamatan_asal_boyolali||'(empty)').padEnd(20)} × ${v.cnt}`);
  }
  await conn2.end();
}

main().catch(console.error);
