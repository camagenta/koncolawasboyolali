'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { fetchApi, type PaginatedResponse } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'

interface Job {
  id: string
  title: string
  description: string
  kategoriBidang?: string
  lokasi?: string
  tipe: 'full-time' | 'part-time' | 'internship'
  linkExternal: string
  kontak?: string
  deadline?: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  poster: { id: string; name: string; email: string }
  viewsCount: number
  createdAt: string
  updatedAt: string
}

const KATEGORI_BIDANG = [
  'Teknologi Informasi',
  'Keuangan & Perbankan',
  'Pendidikan',
  'Kesehatan',
  'Manufaktur',
  'Pemasaran & Sales',
  'Hukum',
  'Pariwisata',
  'Transportasi & Logistik',
  'Media & Kreatif',
  'Pertanian',
  'Lainnya',
]

const TIPE_OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'internship', label: 'Internship' },
]

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function JobsPage() {
  const { user, isAuthenticated } = useAuth()
  const { t } = useTranslation()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filterKategori, setFilterKategori] = useState('')
  const [filterLokasi, setFilterLokasi] = useState('')
  const [filterTipe, setFilterTipe] = useState<string[]>([])

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    kategoriBidang: '',
    lokasi: '',
    tipe: 'full-time',
    linkExternal: '',
    kontak: '',
    deadline: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin_unit'

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string | undefined> = {}
      if (filterKategori) params.kategoriBidang = filterKategori
      if (filterLokasi) params.lokasi = filterLokasi
      if (filterTipe.length > 0) params.tipe = filterTipe.join(',')
      const res = await fetchApi<PaginatedResponse<Job>>('/jobs', { params })
      setJobs(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat lowongan')
    } finally {
      setLoading(false)
    }
  }, [filterKategori, filterLokasi, filterTipe])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetchApi('/jobs', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      setShowCreateModal(false)
      setFormData({
        title: '',
        description: '',
        kategoriBidang: '',
        lokasi: '',
        tipe: 'full-time',
        linkExternal: '',
        kontak: '',
        deadline: '',
      })
      fetchJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat lowongan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async (jobId: string) => {
    try {
      await fetchApi(`/jobs/${jobId}/approve`, { method: 'POST' })
      setSelectedJob(null)
      fetchJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyetujui lowongan')
    }
  }

  const handleReject = async (jobId: string) => {
    if (!rejectionReason.trim()) return
    try {
      await fetchApi(`/jobs/${jobId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ rejectionReason }),
      })
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedJob(null)
      fetchJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menolak lowongan')
    }
  }

  const toggleTipeFilter = (tipe: string) => {
    setFilterTipe((prev) =>
      prev.includes(tipe) ? prev.filter((t) => t !== tipe) : [...prev, tipe],
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.jobs')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Temukan lowongan kerja terbaru untuk alumni
          </p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Lowongan Baru
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Kategori Bidang
            </label>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              {KATEGORI_BIDANG.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lokasi</label>
            <input
              type="text"
              value={filterLokasi}
              onChange={(e) => setFilterLokasi(e.target.value)}
              placeholder="Cari lokasi..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tipe Pekerjaan
            </label>
            <div className="flex flex-wrap gap-3 pt-1">
              {TIPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filterTipe.includes(opt.value)}
                    onChange={() => toggleTipeFilter(opt.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterKategori('')
                setFilterLokasi('')
                setFilterTipe([])
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <p className="text-gray-500 text-sm">Belum ada lowongan yang tersedia</p>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Buat lowongan pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {job.title}
                </h3>
                <span
                  className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}
                >
                  {job.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                <p className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 shrink-0 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {job.poster?.name || 'Unknown'}
                </p>
                {job.lokasi && (
                  <p className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 shrink-0 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.lokasi}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 shrink-0 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  {TIPE_OPTIONS.find((o) => o.value === job.tipe)?.label || job.tipe}
                </p>
                {job.deadline && (
                  <p className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 shrink-0 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Deadline: {formatDate(job.deadline)}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Lihat Detail
                </button>
                <a
                  href={job.linkExternal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Lamar Sekarang
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-3">{timeAgo(job.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Buat Lowongan Baru</h2>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Lowongan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul lowongan"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Deskripsikan lowongan pekerjaan"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori Bidang
                  </label>
                  <select
                    value={formData.kategoriBidang}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kategoriBidang: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih kategori</option>
                    {KATEGORI_BIDANG.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lokasi: e.target.value }))
                    }
                    placeholder="Kota atau daerah"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Pekerjaan *
                  </label>
                  <select
                    required
                    value={formData.tipe}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tipe: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TIPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link External *
                </label>
                <input
                  type="url"
                  required
                  value={formData.linkExternal}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, linkExternal: e.target.value }))
                  }
                  placeholder="https://"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kontak
                </label>
                <input
                  type="text"
                  value={formData.kontak}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, kontak: e.target.value }))
                  }
                  placeholder="Email atau nomor telepon"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Detail Lowongan</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedJob.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedJob.poster?.name}
                  </p>
                </div>
                <span
                  className={`shrink-0 ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedJob.status)}`}
                >
                  {selectedJob.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {selectedJob.kategoriBidang && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {selectedJob.kategoriBidang}
                  </span>
                )}
                {selectedJob.lokasi && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                    <svg
                      className="w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {selectedJob.lokasi}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  <svg
                    className="w-3.5 h-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  {TIPE_OPTIONS.find((o) => o.value === selectedJob.tipe)?.label ||
                    selectedJob.tipe}
                </span>
                {selectedJob.deadline && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                    <svg
                      className="w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Deadline: {formatDate(selectedJob.deadline)}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Deskripsi</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {selectedJob.kontak && (
                  <div>
                    <span className="font-medium text-gray-700">Kontak:</span>{' '}
                    {selectedJob.kontak}
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Dilihat:</span>{' '}
                  {selectedJob.viewsCount} kali
                </div>
                <div>
                  <span className="font-medium text-gray-700">Diposting:</span>{' '}
                  {timeAgo(selectedJob.createdAt)}
                </div>
              </div>

              {selectedJob.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-700 mb-1">
                    Alasan Ditolak
                  </p>
                  <p className="text-sm text-red-600">
                    {selectedJob.rejectionReason}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <a
                  href={selectedJob.linkExternal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lamar Sekarang
                </a>

                {isAdmin && selectedJob.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedJob.id)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Tolak Lowongan</h2>
              <p className="text-sm text-gray-500 mt-1">
                &ldquo;{selectedJob.title}&rdquo;
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alasan Penolakan
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alasan penolakan..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => handleReject(selectedJob.id)}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
