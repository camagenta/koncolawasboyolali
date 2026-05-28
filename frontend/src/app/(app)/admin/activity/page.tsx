'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'

interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: string | null
  entityId: string | null
  metadata: any
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
    avatarUrl?: string
  }
}

const ACTIONS = [
  'login',
  'profile_update',
  'forum_create',
  'forum_comment',
  'forum_like',
  'chat_send',
  'job_create',
  'job_approve',
  'job_reject',
  'import_data',
  'role_change',
]

const ACTION_LABELS: Record<string, string> = {
  login: 'Login',
  profile_update: 'Update Profil',
  forum_create: 'Buat Forum',
  forum_comment: 'Komentar Forum',
  forum_like: 'Suka Forum',
  chat_send: 'Kirim Chat',
  job_create: 'Buat Lowongan',
  job_approve: 'Setujui Lowongan',
  job_reject: 'Tolak Lowongan',
  import_data: 'Import Data',
  role_change: 'Ubah Role',
}

export default function AdminActivityPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)
  const [actionFilter, setActionFilter] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string | number | undefined | null> = {
        page,
        limit,
      }
      if (actionFilter) params.action = actionFilter
      if (searchUser) params.userId = searchUser
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const data = await fetchApi('/admin/activity-logs', { params })
      setLogs(data.data || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat log aktivitas')
    } finally {
      setLoading(false)
    }
  }, [page, limit, actionFilter, searchUser, startDate, endDate])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const totalPages = Math.ceil(total / limit)

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return '-'
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Aktivitas</h2>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Cari user ID..."
          value={searchUser}
          onChange={(e) => { setSearchUser(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 min-w-[150px]"
        />
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Aksi</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Belum ada aktivitas</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Waktu</th>
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Aksi</th>
                  <th className="pb-3 pr-4 font-medium">Tipe Entitas</th>
                  <th className="pb-3 font-medium">ID Entitas</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 pr-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600 shrink-0">
                          {log.user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.user.name}</p>
                          <p className="text-xs text-gray-400">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs whitespace-nowrap">{log.entityType || '-'}</td>
                    <td className="py-3 text-gray-400 text-xs whitespace-nowrap font-mono">{log.entityId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>Halaman {page} dari {totalPages} (total {total})</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
