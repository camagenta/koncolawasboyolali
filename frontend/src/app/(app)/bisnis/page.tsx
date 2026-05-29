'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'

const KATEGORI = ['Kuliner', 'Fashion', 'Teknologi', 'Pendidikan', 'Kesehatan', 'Pertanian', 'Kerajinan', 'Jasa', 'Properti', 'Otomotif', 'Media & Kreatif', 'Lainnya']

interface Business {
  id: string
  namaUsaha: string
  kategori: string
  deskripsi: string
  fotoUsaha?: string
  status: string
  pemilik: { id: string; name: string; avatarUrl?: string }
  isCariMitra: boolean
  createdAt: string
}

export default function BisnisPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [kategori, setKategori] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchBusinesses = async (pageNum: number, replace: boolean) => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string | number | undefined> = { page: pageNum, limit: 12 }
      if (kategori) params.kategori = kategori
      const res = await fetchApi<{ data: Business[]; total: number; page: number; totalPages: number }>('/business', { params })
      if (replace) {
        setBusinesses(res.data)
      } else {
        setBusinesses(prev => [...prev, ...res.data])
      }
      setHasMore(pageNum < res.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data bisnis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchBusinesses(1, true)
  }, [kategori])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchBusinesses(next, false)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return businesses
    const q = search.toLowerCase()
    return businesses.filter(b => b.namaUsaha.toLowerCase().includes(q) || b.deskripsi.toLowerCase().includes(q))
  }, [search, businesses])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Direktori Bisnis Alumni</h1>
        <p className="text-sm text-gray-500 mt-0.5">Temukan dan dukung usaha sesama alumni</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama usaha atau deskripsi..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
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
            {k}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {loading && businesses.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse overflow-hidden">
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-gray-500 text-sm mb-4">Belum ada usaha terdaftar. Jadilah yang pertama!</p>
          <Link href="/profile" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Daftarkan usahamu →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((b) => (
              <Link
                key={b.id}
                href={`/bisnis/${b.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="h-40 overflow-hidden">
                  {b.fotoUsaha ? (
                    <img src={b.fotoUsaha} alt={b.namaUsaha} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {b.kategori}
                    </span>
                    {b.isCariMitra && (
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                        Cari Mitra
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {b.namaUsaha}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    oleh {b.pemilik.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
                    {b.deskripsi}
                  </p>
                </div>
              </Link>
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

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-white mb-1">Punya Usaha?</h2>
        <p className="text-sm text-blue-100 mb-4">Daftarkan bisnismu dan dapatkan exposure dari sesama alumni</p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          Daftarkan di sini
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
