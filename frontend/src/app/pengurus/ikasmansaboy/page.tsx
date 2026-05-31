'use client'

import { useState } from 'react'
import { profilesLama, type ProfileLama } from '@/lib/profil-pengurus-lama'

const kategoriConfig: Record<string, { label: string; icon: string; desc: string }> = {
  'dewan-pembina': { label: 'Dewan Pembina', icon: '🏛️', desc: 'Dewan Pembina' },
  'dewan-penasehat': { label: 'Dewan Penasehat', icon: '👁️', desc: 'Dewan Penasehat' },
  'dewan-pakar': { label: 'Dewan Pakar', icon: '🎓', desc: 'Dewan Pakar' },
  'pengurus-pusat': { label: 'Pengurus Pusat', icon: '⚙️', desc: 'Pengurus Pusat' },
}

const subkategoriOrder = [
  'Pimpinan', 'Kesekretariatan', 'Hukum', 'Humas', 'Bendahara',
  'Akuntansi & Pelaporan', 'Pendanaan', 'Perencanaan & Anggaran', 'Kealmamateran', 'Kealumnian',
]

function initials(nama: string) {
  const parts = nama.split(' ')
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : nama.slice(0, 2).toUpperCase()
}

function ProfileCard({ person }: { person: ProfileLama }) {
  const [imgErr, setImgErr] = useState(false)
  const hasFoto = !!person.foto && !imgErr

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* photo area */}
      <div className={`h-36 flex items-center justify-center ${hasFoto ? '' : 'bg-gradient-to-br from-slate-600 to-slate-800'}`}>
        {hasFoto ? (
          <img src={person.foto} alt={person.nama} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
        ) : (
          <div className="text-center">
            <span className="text-3xl font-bold text-white/90 tracking-wider">{initials(person.nama)}</span>
          </div>
        )}
      </div>

      {/* info area */}
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-gray-900 leading-tight">{person.nama}</h3>
        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mt-0.5">{person.jabatan}</p>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{person.angkatan}</span>
        </div>

        {person.posisi && (
          <div className="bg-blue-50 rounded-lg p-2 mt-2 border-l-2 border-blue-600">
            <p className="text-[10px] font-semibold text-blue-800">📌 {person.posisi}</p>
          </div>
        )}

        {person.ringkasan && (
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed line-clamp-3">{person.ringkasan}</p>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
        active ? 'text-blue-700 bg-white border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon} {label}
    </button>
  )
}

function SubkategoriSection({ title, members }: { title: string; members: ProfileLama[] }) {
  return (
    <div>
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
        <h3 className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
        {members.map((p) => (
          <ProfileCard key={`${p.nama}-${p.jabatan}-${p.subkategori}`} person={p} />
        ))}
      </div>
    </div>
  )
}

export default function PengurusIkasmansaboyPage() {
  const [activeTab, setActiveTab] = useState<string>('dewan-pembina')
  const filtered = profilesLama.filter((p) => p.kategori === activeTab)

  const isPusat = activeTab === 'pengurus-pusat'
  const grouped: Record<string, ProfileLama[]> = {}
  if (isPusat) {
    for (const m of filtered) {
      const key = m.subkategori || 'Lainnya'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(m)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-1">PENGURUS IKA SMANSA BOY</h1>
          <p className="text-slate-300 text-sm">Periode 2022–2025</p>
          <p className="text-slate-400 text-xs mt-2 max-w-xl mx-auto">
            Berdasarkan SK Ketua Umum No. 001/Kep/Ketum/PP-IKA SMANSA BOY/I/2023
          </p>
        </div>

        {/* tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10">
          {Object.entries(kategoriConfig).map(([key, cfg]) => (
            <TabButton
              key={key}
              active={activeTab === key}
              onClick={() => setActiveTab(key)}
              label={cfg.label}
              icon={cfg.icon}
            />
          ))}
        </div>

        {/* content */}
        <div className="p-4 sm:p-6">
          {isPusat ? (
            <div className="space-y-4">
              {subkategoriOrder.filter((sk) => grouped[sk]).map((sk) => (
                <div key={sk} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <SubkategoriSection title={sk} members={grouped[sk]} />
                </div>
              ))}
              {/* remaining uncategorized */}
              {Object.entries(grouped)
                .filter(([k]) => !subkategoriOrder.includes(k))
                .map(([k, v]) => (
                  <div key={k} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <SubkategoriSection title={k} members={v} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProfileCard key={`${p.nama}-${p.jabatan}`} person={p} />
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="text-center py-6 px-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400">
            Sumber:{' '}
            <a href="https://www.scribd.com/document/846076192/SALINAN-SK-KETUM-IKA-SMANSA-BOY" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              SK Ketua Umum IKA SMANSA BOY No. 001/Kep/Ketum/PP-IKA SMANSA BOY/I/2023
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Data diarsipkan untuk dokumentasi kepengurusan IKA SMA Negeri 1 Boyolali
          </p>
          <div className="mt-3">
            <a href="/pengurus/ikaboy" className="text-xs text-blue-600 hover:underline">
              ← Kembali ke pengurus periode saat ini
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
