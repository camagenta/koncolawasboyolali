'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { fetchApi, downloadBlob } from '@/lib/api'

interface Stats {
  totalUsers: number
  totalAlumni: number
  totalAdminUnits: number
  totalJobsPending: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exportLoading, setExportLoading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [statsData, usersData] = await Promise.all([
          fetchApi('/admin/stats'),
          fetchApi('/admin/users?limit=5'),
        ])
        setStats(statsData as Stats)
        setRecentUsers((usersData as { users: User[] }).users || [])
        setStats(statsData)
        setRecentUsers(usersData.users || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {error}
      </div>
    )
  }

  const statCards = [
    { label: t('admin.stats.totalUsers'), value: stats?.totalUsers ?? 0, color: 'bg-blue-100 text-blue-600' },
    { label: t('admin.stats.totalAlumni'), value: stats?.totalAlumni ?? 0, color: 'bg-green-100 text-green-600' },
    { label: t('admin.stats.totalAdminUnits'), value: stats?.totalAdminUnits ?? 0, color: 'bg-purple-100 text-purple-600' },
    { label: t('admin.stats.totalJobsPending'), value: stats?.totalJobsPending ?? 0, color: 'bg-amber-100 text-amber-600' },
  ]

  const maxStat = Math.max(...statCards.map((c) => c.value), 1)

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return '-' }
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <span className="text-lg font-bold">{card.value}</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">{t('admin.stats.recentUsers')}</h3>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-400">{t('admin.noUsers')}</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                    {u.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(u.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Overview</h3>
          <div className="space-y-4">
            {statCards.map((card) => {
              const pct = maxStat > 0 ? (card.value / maxStat) * 100 : 0
              return (
                <div key={card.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{card.label}</span>
                    <span className="font-semibold text-gray-900">{card.value}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        card.color.split(' ')[0]
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              setExportLoading('csv')
              try { await downloadBlob('/export/alumni/csv', 'alumni.csv') }
              finally { setExportLoading(null) }
            }}
            disabled={exportLoading === 'csv'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading === 'csv' ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Loading...
              </span>
            ) : 'Export CSV'}
          </button>
          <button
            onClick={async () => {
              setExportLoading('excel')
              try { await downloadBlob('/export/alumni/excel', 'alumni.xlsx') }
              finally { setExportLoading(null) }
            }}
            disabled={exportLoading === 'excel'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading === 'excel' ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Loading...
              </span>
            ) : 'Export Excel'}
          </button>
          <button
            onClick={async () => {
              setExportLoading('stats')
              try { await downloadBlob('/export/stats', 'statistik.csv') }
              finally { setExportLoading(null) }
            }}
            disabled={exportLoading === 'stats'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading === 'stats' ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Loading...
              </span>
            ) : 'Export Statistik'}
          </button>
        </div>
      </div>
    </div>
  )
}
