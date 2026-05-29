'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'

interface StatsOverview {
  total: number
  totalForumThreads: number
  totalJobs: number
  byTahunLulus?: { tahun: number; count: number }[]
  byStatusUtama?: { status: string; count: number }[]
}

interface Thread {
  id: string
  title: string
  content: string
  author: { id: string; name: string; avatarUrl?: string }
  commentCount: number
  createdAt: string
  categoryId: string
}

interface Job {
  id: string
  title: string
  tipe: string
  lokasi?: string
  poster?: { id: string; name: string }
  createdAt: string
  linkExternal: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsOverview | null>(null)
  const [recentThreads, setRecentThreads] = useState<Thread[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setFetchError(null)
      try {
        const [statsData, threadsData, jobsData] = await Promise.all([
          fetchApi<StatsOverview>('/stats/overview'),
          fetchApi<{ data: Thread[] }>('/forums/threads', {
            params: { limit: 5 },
          }).catch(() => ({ data: [] })),
          fetchApi<{ data: Job[] }>('/jobs', { params: { limit: 5 } }).catch(() => ({ data: [] })),
        ])
        setStats(statsData)
        setRecentThreads(threadsData.data)
        setRecentJobs(jobsData.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal memuat data dashboard'
        setFetchError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hai, {user?.name || 'Pengguna'}!
          </h1>
          <p className="text-sm text-gray-500">{t('app.tagline')}</p>
        </div>
      </div>

      {fetchError && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{fetchError}</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto text-red-600 underline hover:text-red-800 shrink-0"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-gray-100 rounded mb-2" />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total Alumni
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.total ?? 0}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Forum Thread
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalForumThreads ?? 0}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
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
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total Lowongan
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalJobs ?? 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Aktivitas Terbaru</h2>
                <Link
                  href="/forum"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentThreads.length === 0 ? (
                  <p className="p-5 text-sm text-gray-400 text-center">
                    Belum ada diskusi
                  </p>
                ) : (
                  recentThreads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/forum/${thread.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span>{thread.author?.name}</span>
                        <span>{timeAgo(thread.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {thread.commentCount}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Lowongan Terbaru</h2>
                <Link
                  href="/jobs"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentJobs.length === 0 ? (
                  <p className="p-5 text-sm text-gray-400 text-center">
                    Belum ada lowongan
                  </p>
                ) : (
                  recentJobs.map((job) => (
                    <a
                      key={job.id}
                      href={job.linkExternal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span>{job.poster?.name}</span>
                        {job.lokasi && <span>{job.lokasi}</span>}
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
