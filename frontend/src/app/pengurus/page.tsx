'use client'

import { useState } from 'react'
import { profiles, type Profile } from '@/lib/profil-pengurus'

const kategoriLabels: Record<string, string> = {
  'dewan-pembina': 'Dewan Pembina',
  'dewan-pengawas': 'Dewan Pengawas',
  'pengurus-pusat': 'Pengurus Pusat',
  'bidang': 'Bidang'
}

const kategoriIcons: Record<string, string> = {
  'dewan-pembina': '🏛️',
  'dewan-pengawas': '👁️',
  'pengurus-pusat': '⚙️',
  'bidang': '📋'
}

function ProfileCard({ profile }: { profile: Profile }) {
  const [imgError, setImgError] = useState(false)
  const hasPhoto = profile.foto && !imgError

  const genderEmoji = profile.gender === 'Perempuan' ? '👩' : '👤'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`h-40 flex items-center justify-center relative overflow-hidden ${hasPhoto ? '' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
        {hasPhoto ? (
          <img
            src={profile.foto}
            alt={profile.nama}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-center text-white">
            <span className="text-5xl block mb-1">{genderEmoji}</span>
            {profile.gender && (
              <span className="text-xs bg-black/30 px-2.5 py-0.5 rounded-full">
                {profile.gender}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="border-b border-gray-100 pb-2.5 mb-2.5">
          <h3 className="text-sm font-bold text-gray-900 leading-tight">
            {profile.namaLengkap || profile.nama}
          </h3>
          <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider mt-0.5">
            {profile.jabatan}
          </p>
        </div>

        {profile.estimasiAngkatan && (
          <div className="flex gap-2 text-xs mb-1.5">
            <span className="font-semibold text-gray-600 min-w-[90px]">Angkatan:</span>
            <span className="text-gray-500">{profile.estimasiAngkatan}</span>
          </div>
        )}

        {profile.posisi && profile.posisi !== 'Belum ditemukan data publik' && (
          <div className="bg-blue-50 rounded-lg p-2.5 mt-2 border-l-2 border-blue-600">
            <p className="text-xs font-semibold text-blue-800 mb-0.5">📌 Posisi Terakhir</p>
            <p className="text-xs text-blue-700 leading-relaxed">{profile.posisi}</p>
          </div>
        )}

        {profile.ringkasan && (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{profile.ringkasan}</p>
        )}

        {profile.sumber && (
          <p className="text-[10px] text-gray-400 mt-2 italic">Sumber: {profile.sumber}</p>
        )}

        {profile.posisi === 'Belum ditemukan data publik' && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
            <span>⏳</span>
            <span>Data belum tersedia di sumber publik</span>
          </div>
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
        active
          ? 'text-blue-700 bg-white border-b-2 border-blue-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon} {label}
    </button>
  )
}

export default function PengurusPage() {
  const [activeTab, setActiveTab] = useState<string>('dewan-pembina')

  const filtered = profiles.filter((p) => p.kategori === activeTab)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-8 text-center">
          <h1 className="text-2xl font-bold mb-1.5">PROFIL PENGURUS IKA</h1>
          <p className="text-blue-100 text-sm max-w-2xl mx-auto">
            SMA Negeri 1 Boyolali &mdash; Dewan Pembina | Dewan Pengawas | Pengurus Pusat | Bidang
          </p>
          <p className="text-blue-200/70 text-xs mt-2">
            Data dihimpun dari struktur organisasi, data alumni, dan sumber publik
          </p>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/80 gap-0 sticky top-0 z-10">
          {Object.entries(kategoriLabels).map(([key, label]) => (
            <TabButton
              key={key}
              active={activeTab === key}
              onClick={() => setActiveTab(key)}
              label={label}
              icon={kategoriIcons[key]}
            />
          ))}
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((profile) => (
              <ProfileCard key={`${profile.nama}-${profile.jabatan}`} profile={profile} />
            ))}
          </div>
        </div>

        <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-200 bg-white">
          IKA SMA Negeri 1 Boyolali &bull; Data dihimpun dari sumber publik &bull; Terakhir diperbarui: Mei 2026
        </div>
      </div>
    </div>
  )
}
