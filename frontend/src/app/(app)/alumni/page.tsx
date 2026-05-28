'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { fetchApi, type PaginatedResponse } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'

interface AlumniCard {
  id: string
  namaLengkap: string
  fotoProfil?: string
  tahunMasuk: number
  jurusan?: string
  kotaDomisili: string
  statusUtama: string
  user: { id: string; name: string; avatarUrl?: string }
}

const TAHUN_OPTIONS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i)
const JURUSAN_OPTIONS = ['IPA', 'IPS', 'Bahasa']
const STATUS_OPTIONS = ['Bekerja', 'Kuliah', 'Wirausaha', 'Belum_Bekerja', 'Lainnya']

function getStatusColor(status: string) {
  switch (status) {
    case 'Bekerja': return 'bg-green-100 text-green-700'
    case 'Kuliah': return 'bg-blue-100 text-blue-700'
    case 'Wirausaha': return 'bg-purple-100 text-purple-700'
    case 'Belum_Bekerja': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const statusLabel = (s: string) => s === 'Belum_Bekerja' ? 'Belum Bekerja' : s

export default function AlumniDirectoryPage() {
  const { t } = useTranslation()

  const [data, setData] = useState<AlumniCard[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 12

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filterTahun, setFilterTahun] = useState('')
  const [filterJurusan, setFilterJurusan] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchAlumni = useCallback(async (p: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchApi<PaginatedResponse<AlumniCard>>('/alumni/profiles', {
        params: {
          q: search || null,
          page: p,
          limit,
          tahunMasuk: filterTahun || null,
          jurusan: filterJurusan || null,
          statusUtama: filterStatus || null,
          sortBy: 'nama',
          sortOrder: 'asc',
        },
      })
      setData(res.data)
      setTotal(res.total)
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data alumni')
    } finally {
      setLoading(false)
    }
  }, [search, filterTahun, filterJurusan, filterStatus])

  useEffect(() => {
    fetchAlumni(1)
  }, [fetchAlumni])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAlumni(1)
  }

  const resetFilters = () => {
    setSearch('')
    setFilterTahun('')
    setFilterJurusan('')
    setFilterStatus('')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Direktori Alumni</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total > 0 ? `${total} alumni terdaftar` : 'Jelajahi profil alumni SMAN 1 Boyolali'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === 'grid' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border transition-colors ${
              viewMode === 'list' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari alumni berdasarkan nama atau NIS..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.search')}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Tahun</option>
            {TAHUN_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Jurusan</option>
            {JURUSAN_OPTIONS.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
        }>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="text-gray-500 text-sm">Tidak ada alumni yang ditemukan</p>
          <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Reset filter pencarian
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((alumni) => (
              <Link
                key={alumni.id}
                href={`/alumni/${alumni.id}`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-3">
                    {alumni.fotoProfil ? (
                      <img src={alumni.fotoProfil} alt={alumni.namaLengkap} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{alumni.namaLengkap}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Angkatan {alumni.tahunMasuk}</p>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {alumni.jurusan && <p className="text-center">{alumni.jurusan}</p>}
                  <p className="flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {alumni.kotaDomisili}
                  </p>
                </div>
                <div className="mt-3 flex justify-center">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(alumni.statusUtama)}`}>
                    {statusLabel(alumni.statusUtama)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchAlumni(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchAlumni(p)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    p === page ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => fetchAlumni(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-3">
            {data.map((alumni) => (
              <Link
                key={alumni.id}
                href={`/alumni/${alumni.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {alumni.fotoProfil ? (
                      <img src={alumni.fotoProfil} alt={alumni.namaLengkap} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{alumni.namaLengkap}</h3>
                      <span className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(alumni.statusUtama)}`}>
                        {statusLabel(alumni.statusUtama)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Angkatan {alumni.tahunMasuk}{alumni.jurusan && ` · ${alumni.jurusan}`} · {alumni.kotaDomisili}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchAlumni(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchAlumni(p)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    p === page ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => fetchAlumni(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
