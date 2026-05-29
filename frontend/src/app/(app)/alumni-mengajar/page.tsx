'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'

const KATEGORI = ['Teknologi', 'Bisnis', 'Kesehatan', 'Kreatif', 'Pendidikan', 'Bahasa', 'Olahraga', 'Seni', 'Lainnya']
const FORMATS = ['Workshop', 'Seminar', 'Webinar', 'Pelatihan', 'Mentoring']

const KATEGORI_ICON: Record<string, string> = {
  Teknologi: '💻',
  Bisnis: '💼',
  Kesehatan: '🩺',
  Kreatif: '🎨',
  Pendidikan: '📚',
  Bahasa: '🌐',
  Olahraga: '⚽',
  Seni: '🎭',
  Lainnya: '✨',
}

const LEVEL_STYLES: Record<string, string> = {
  Pemula: 'bg-green-100 text-green-700',
  Menengah: 'bg-yellow-100 text-yellow-700',
  Lanjut: 'bg-red-100 text-red-700',
}

interface AlumniInfo {
  id: string
  name: string
  avatarUrl?: string
}

interface Skill {
  id: string
  namaKeahlian: string
  kategori: string
  deskripsi?: string
  format: string
  level: string
  ketersediaan: string
  alumni: AlumniInfo
  createdAt: string
}

export default function AlumniMengajarPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [kategori, setKategori] = useState('')
  const [format, setFormat] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchSkills = async (pageNum: number, replace: boolean) => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string | number | undefined> = { page: pageNum, limit: 12 }
      if (kategori) params.kategori = kategori
      if (format) params.format = format
      const res = await fetchApi<{ data: Skill[]; total: number; page: number; totalPages: number }>('/alumni-skill', { params })
      if (replace) {
        setSkills(res.data)
      } else {
        setSkills(prev => [...prev, ...res.data])
      }
      setHasMore(pageNum < res.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data keahlian')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchSkills(1, true)
  }, [kategori, format])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchSkills(next, false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alumni Mengajar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Belajar dari keahlian sesama alumni SMANSA</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setKategori('')}
            className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !kategori ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {KATEGORI.map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                kategori === k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {KATEGORI_ICON[k]} {k}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFormat('')}
            className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !format ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua Format
          </button>
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                format === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {loading && skills.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse p-5">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-6 bg-gray-200 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <p className="text-gray-500 text-sm mb-4">Belum ada keahlian yang ditawarkan</p>
          <Link href="/alumni-mengajar/request" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Minta keahlian tertentu →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-3">{KATEGORI_ICON[skill.kategori] || '✨'}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{skill.namaKeahlian}</h3>
                <Link
                  href={`/alumni/${skill.alumni.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {skill.alumni.name}
                </Link>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {skill.format}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${LEVEL_STYLES[skill.level] || 'bg-gray-100 text-gray-700'}`}>
                    {skill.level}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    skill.ketersediaan === 'online' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {skill.ketersediaan === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                {skill.deskripsi && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{skill.deskripsi}</p>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Memuat...' : 'Muat Lainnya'}
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-white mb-1">Punya keahlian?</h2>
        <p className="text-sm text-indigo-100 mb-4">Bagikan dengan sesama alumni</p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Tambah Keahlian
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
