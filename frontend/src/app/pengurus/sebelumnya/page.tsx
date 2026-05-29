'use client'

import { profilesLama, type ProfileLama } from '@/lib/profil-pengurus-lama'

const kategoriConfig: Record<string, { label: string; icon: string }> = {
  'dewan-pembina': { label: 'Dewan Pembina', icon: '🏛️' },
  'dewan-penasehat': { label: 'Dewan Penasehat', icon: '👁️' },
  'dewan-pakar': { label: 'Dewan Pakar', icon: '🎓' },
  'pengurus-pusat': { label: 'Pengurus Pusat', icon: '⚙️' },
}

const subkategoriOrder = [
  'Pimpinan',
  'Kesekretariatan',
  'Hukum',
  'Humas',
  'Bendahara',
  'Akuntansi & Pelaporan',
  'Pendanaan',
  'Perencanaan & Anggaran',
  'Kealmamateran',
  'Kealumnian',
]

function PersonRow({ person }: { person: ProfileLama }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-900">{person.nama}</span>
        <p className="text-[11px] text-gray-500 mt-0.5">{person.jabatan}</p>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        {person.posisi && (
          <p className="text-[11px] text-blue-600 leading-tight mb-0.5">{person.posisi}</p>
        )}
        <span className="text-[11px] font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          {person.angkatan}
        </span>
      </div>
    </div>
  )
}

function SectionCard({ category }: { category: string }) {
  const config = kategoriConfig[category]
  const members = profilesLama.filter((p) => p.kategori === category)

  if (members.length === 0) return null

  if (category === 'pengurus-pusat') {
    const grouped: Record<string, ProfileLama[]> = {}
    for (const m of members) {
      const key = m.subkategori || 'Lainnya'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(m)
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-900 text-white px-5 py-3 flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <h2 className="text-sm font-bold tracking-wide">{config.label}</h2>
          <span className="ml-auto text-xs text-blue-200">({members.length} orang)</span>
        </div>
        {subkategoriOrder.filter((sk) => grouped[sk]).map((sk) => (
          <div key={sk}>
            <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider">{sk}</h3>
            </div>
            <div>
              {grouped[sk].map((person) => (
                <PersonRow key={`${person.nama}-${person.jabatan}`} person={person} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-900 text-white px-5 py-3 flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <h2 className="text-sm font-bold tracking-wide">{config.label}</h2>
        <span className="ml-auto text-xs text-blue-200">({members.length} orang)</span>
      </div>
      <div className="divide-y divide-gray-100">
        {members.map((person) => (
          <PersonRow key={`${person.nama}-${person.jabatan}`} person={person} />
        ))}
      </div>
    </div>
  )
}

export default function PengurusSebelumnyaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-1.5">PENGURUS IKA SMANSA BOY</h1>
          <p className="text-blue-100 text-sm">Periode 2022–2025</p>
          <p className="text-blue-200/70 text-xs mt-2">
            Berdasarkan SK Ketua Umum No. 001/Kep/Ketum/PP-IKA SMANSA BOY/I/2023
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {['dewan-pembina', 'dewan-penasehat', 'dewan-pakar', 'pengurus-pusat'].map((cat) => (
            <SectionCard key={cat} category={cat} />
          ))}
        </div>

        <div className="text-center py-6 px-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400">
            Sumber:{' '}
            <a
              href="https://www.scribd.com/document/846076192/SALINAN-SK-KETUM-IKA-SMANSA-BOY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Salinan SK Ketua Umum IKA SMANSA BOY No. 001/Kep/Ketum/PP-IKA SMANSA BOY/I/2023
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Data diarsipkan untuk dokumentasi kepengurusan IKA SMA Negeri 1 Boyolali
          </p>
        </div>
      </div>
    </div>
  )
}
