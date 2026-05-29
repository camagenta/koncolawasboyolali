/**
 * SMANSABOY-OSINT v2 — Agent launcher
 * 
 * Membaca baseline JSON per kategori, meluncurkan agent paralel
 * dengan metodologi OSINT v2 untuk setiap kategori profil.
 * 
 * Usage: node scripts/osint-v2-launcher.js
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');
const BASELINE_DIR = path.join(__dirname, '..', 'tmp', 'osint');

const AGENT_PROMPT = `Anda adalah "SMANSABOY-OSINT v2", mesin AI Agen Khusus dengan keahlian di Open Source Intelligence (OSINT), Analisis Investigasi Digital, dan Visual Verification.

Tugas Anda: mengekstraksi data dari daftar Pengurus Alumni SMAN 1 Boyolali dan mengubahnya menjadi strategi pelacakan digital yang presisi, dengan fokus pada pencarian dokumentasi visual (foto wajah/identitas) target.

# MAIN GOALS
1. Mendapatkan informasi posisi profesional, domisili, dan profil media sosial saat ini.
2. Menemukan dokumentasi visual (FOTO WAJAH/IDENTITAS RESMI) dari target.
3. Memvalidasi kontak digital (LinkedIn, Instagram, Email).

# INPUT
Anda akan menerima file JSON berisi daftar profil. Setiap profil memiliki:
- nama (string)
- jabatan (string)
- kategori (string)
- angkatan / estimasiAngkatan (string)
- tahunLulus (string, optional)

# CORE PROTOCOLS
1. NO THEORY: Langsung berikan output findings JSON.
2. CROSS-REFERENCE: Cocokkan temuan internet dengan data internal kepengurusan alumni.
3. GENERATION LOGIC:
   - Angkatan < 2000 (Senior): Fokus pada album kenangan digital, foto reuni, dokumentasi pelantikan ASN, foto profil Facebook jadul.
   - Angkatan >= 2000 (Modern): Fokus pada LinkedIn, Instagram, web korporat modern.
4. OUTPUT FORMAT: Findings JSON dengan struktur:
   { "sheetName": "...", "findings": { "Nama": { "foto": "url", "linkedin": "url", "instagram": "url", "ringkasan": "bio", "sumber": "src", "posisi": "posisi", "gender": "L/P", "tahunLulus": "thn", "angkatan": "thn" } } }

# SEARCH METHODOLOGY
Untuk setiap profil, lakukan:
1. Google Images search: "{nama}" SMAN 1 Boyolali
2. Google Images search: "{nama}" profil
3. LinkedIn search: "{nama}" LinkedIn
4. Google search: "{nama}" site:id.wikipedia.org
5. Google search: "{nama}" site:kompas.com OR site:detik.com OR site:tribunnews.com
6. Google search: "{nama}" alumni SMAN 1 Boyolali
7. Instagram search via Google: "{nama}" site:instagram.com

# OUTPUT DIRECTORY
Simpan findings JSON ke /home/ubuntu/koncolawas/tmp/osint/v2-findings/<category>.json

# IMPORTANT
- Jika foto tidak ditemukan setelah 3+ pencarian, jangan isi field foto.
- Jika nama terlalu umum dan tidak ada jejak spesifik SMAN 1 Boyolali, tulis ringkasan: "Tidak ditemukan jejak digital publik spesifik."
- Pastikan url yang valid (mulai dengan http).
- Escaping: escape single quotes dalam nilai string.
`;

const CATEGORIES = [
  {
    name: 'lama_top',
    sheetName: 'PENGURUS LAMA',
    files: ['PENGURUS_LAMA_Dewan_Pembina.json', 'PENGURUS_LAMA_Dewan_Penasehat.json', 'PENGURUS_LAMA_Dewan_Pakar.json'],
    desc: 'LAMA Dewan Pembina + Penasehat + Pakar (33 profil)'
  },
  {
    name: 'lama_pusat',
    sheetName: 'PENGURUS LAMA',
    files: ['PENGURUS_LAMA_Pengurus_Pusat.json'],
    desc: 'LAMA Pengurus Pusat (62 profil)'
  },
  {
    name: 'baru_top',
    sheetName: 'PENGURUS BARU',
    files: ['PENGURUS_BARU_Dewan_Pembina.json', 'PENGURUS_BARU_Dewan_Pengawas.json'],
    desc: 'BARU Dewan Pembina + Pengawas (28 profil)'
  },
  {
    name: 'baru_staff',
    sheetName: 'PENGURUS BARU',
    files: ['PENGURUS_BARU_Pengurus_Pusat.json', 'PENGURUS_BARU_Bidang.json'],
    desc: 'BARU Pengurus Pusat + Bidang (39 profil)'
  }
];

async function main() {
  const fs = require('fs');
  const outDir = path.join(BASELINE_DIR, 'v2-prompts');
  fs.mkdirSync(outDir, { recursive: true });

  for (const cat of CATEGORIES) {
    // Collect all profiles from files
    let allRows = [];
    for (const file of cat.files) {
      const data = JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, file), 'utf8'));
      allRows = allRows.concat(data.rows);
    }

    // Write agent prompt file
    const prompt = AGENT_PROMPT + `\n\n# YOUR ASSIGNMENT: ${cat.desc}\n` +
      `Sheet name: ${cat.sheetName}\n\n` +
      `## PROFILES TO RESEARCH (${allRows.length} total)\n\n` +
      allRows.map((r, i) => `${i+1}. ${r[4]} | Jabatan: ${r[3]} | Angkatan: ${r[6] || r[7] || '-'}`).join('\n');

    // Write summary for agent usage
    const summaryPath = path.join(outDir, `${cat.name}.txt`);
    fs.writeFileSync(summaryPath, prompt);
    console.log(`${cat.name}: ${allRows.length} profil -> ${summaryPath}`);
  }

  console.log('\nAgent prompts siap di ${outDir}');
  console.log('Gunakan task tool untuk meluncurkan 4 agent paralel dengan prompt dari file-file ini.');
}

main().catch(console.error);
