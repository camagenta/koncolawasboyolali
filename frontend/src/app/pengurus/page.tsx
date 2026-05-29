'use client'

import { useEffect, useState } from 'react'
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

        {profile.kontak && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {profile.kontak.linkedin && (
              <a href={profile.kontak.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            )}
            {profile.kontak.instagram && (
              <a href={profile.kontak.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-pink-600 bg-pink-50 px-2 py-0.5 rounded hover:bg-pink-100 transition-colors">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            )}
          </div>
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

  useEffect(() => {
    document.title = 'Profil Pengurus IKA - SMA N 1 Boyolali'

    const setMeta = (name: string, content: string, property?: string) => {
      const attr = property ? 'property' : 'name'
      const key = property || name
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLElement | null
      if (el) {
        el.setAttribute('content', content)
      } else {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        el.setAttribute('content', content)
        document.head.appendChild(el)
      }
    }

    setMeta('description', 'Profil lengkap pengurus Ikatan Alumni SMA Negeri 1 Boyolali periode 2025-2030 — Dewan Pembina, Dewan Pengawas, Pengurus Pusat, dan Bidang.')
    setMeta('og:title', 'Profil Pengurus IKA - SMA N 1 Boyolali', 'og:title')
    setMeta('og:description', 'Profil lengkap pengurus Ikatan Alumni SMA Negeri 1 Boyolali periode 2025-2030 — Dewan Pembina, Dewan Pengawas, Pengurus Pusat, dan Bidang.', 'og:description')
    setMeta('og:type', 'website', 'og:type')
    setMeta('og:url', 'https://ikasmansaboy.com/pengurus', 'og:url')
  }, [])

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
