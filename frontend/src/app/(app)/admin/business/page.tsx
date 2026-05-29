'use client'

import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

interface Business {
  id: string
  namaUsaha: string
  kategori: string
  deskripsi: string
  status: 'pending' | 'active' | 'rejected'
  rejectionReason?: string
  isCariMitra: boolean
  pemilik: { id: string; name: string }
  createdAt: string
}

type StatusTab = 'all' | 'pending' | 'active' | 'rejected'

const TABS: { key: StatusTab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'rejected', label: 'Ditolak' },
]

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '-'
  }
}

export default function AdminBusinessPage() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState<{ business: Business } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<Business | null>(null)

  const fetchBusinesses = async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string | undefined> = {}
      if (tab !== 'all') params.status = tab
      const res = await fetchApi<{ data: Business[] }>('/business', { params })
      setBusinesses(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBusinesses() }, [tab])

  const handleApprove = async (id: string) => {
    setActionLoading(true)
    try {
      await fetchApi(`/business/${id}/approve`, { method: 'PATCH' })
      fetchBusinesses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyetujui')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectModal) return
    setActionLoading(true)
    try {
      await fetchApi(`/business/${rejectModal.business.id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ rejectionReason: rejectReason }),
      })
      setRejectModal(null)
      setRejectReason('')
      fetchBusinesses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menolak')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setActionLoading(true)
    try {
      await fetchApi(`/business/${deleteConfirm.id}`, { method: 'DELETE' })
      setDeleteConfirm(null)
      fetchBusinesses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus')
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = businesses.filter((b) => {
    if (!search.trim()) return true
    return b.namaUsaha.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Kelola Bisnis Alumni</h2>
        <p className="text-sm text-gray-500 mt-0.5">Setujui atau tolak pendaftaran bisnis alumni</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex gap-1 border-b border-gray-200 pb-2 overflow-x-auto">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                tab === tb.key ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama usaha..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-400 text-sm">
            {tab === 'all' ? 'Belum ada bisnis terdaftar' : `Tidak ada bisnis dengan status "${TABS.find(t => t.key === tab)?.label}"`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nama Usaha</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Pemilik</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tanggal</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {b.namaUsaha}
                      {b.isCariMitra && (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                          Mitra
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.pemilik.name}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.kategori}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_BADGE[b.status]}`}>
                        {b.status === 'pending' ? 'Pending' : b.status === 'active' ? 'Active' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{formatDate(b.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(b.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => setRejectModal({ business: b })}
                              disabled={actionLoading}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeleteConfirm(b)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Tolak Bisnis</h3>
              <p className="text-sm text-gray-500 mt-1">&ldquo;{rejectModal.business.namaUsaha}&rdquo;</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Penolakan</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setRejectModal(null); setRejectReason('') }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? 'Memproses...' : 'Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Bisnis</h3>
            <p className="text-sm text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus &ldquo;{deleteConfirm.namaUsaha}&rdquo;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
