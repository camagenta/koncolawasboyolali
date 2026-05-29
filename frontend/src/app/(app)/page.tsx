'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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

interface BusinessItem {
  id: string
  namaUsaha: string
  deskripsi?: string
  kategori: string
  alumniProfile: {
    user: { id: string; name: string; avatarUrl?: string }
  }
  createdAt: string
}

interface SkillItem {
  id: string
  skill: string
  deskripsi?: string
  kategori: string
  format: string
  alumniProfile: {
    user: { id: string; name: string; avatarUrl?: string }
  }
  createdAt: string
}

interface SuccessStoryItem {
  id: string
  name: string
  achievement: string
  angkatan: number
  photoUrl?: string
  createdAt: string
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface FeedItem {
  id: string
  type: 'forum' | 'jobs' | 'business' | 'success' | 'skill'
  icon: string
  actorName: string
  action: string
  title: string
  description?: string
  href: string
  timestamp: string
  metadata?: {
    commentCount?: number
    kategori?: string
    angkatan?: number
    tipe?: string
  }
}

const FEED_PAGE_SIZE = 10

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsOverview | null>(null)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [displayCount, setDisplayCount] = useState(FEED_PAGE_SIZE)
  const [fetchErrors, setFetchErrors] = useState<string[]>([])
  const [featuredStories, setFeaturedStories] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      setError(null)
      setFetchErrors([])
      const errors: string[] = []

      const [statsData, threadsData, jobsData, businessData, successData, skillData, featuredData] =
        await Promise.all([
          fetchApi<StatsOverview>('/stats/overview').catch((err) => {
            errors.push(`stats: ${err.message}`)
            return null
          }),
          fetchApi<{ data: Thread[] }>('/forums/threads', { params: { limit: 5 } })
            .catch(() => ({ data: [] as Thread[] })),
          fetchApi<{ data: Job[] }>('/jobs', { params: { limit: 5 } })
            .catch(() => ({ data: [] as Job[] })),
          fetchApi<PaginatedResponse<BusinessItem>>('/business', { params: { limit: 5 } })
            .catch(() => null),
          fetchApi<PaginatedResponse<SuccessStoryItem>>('/success-stories', { params: { limit: 5 } })
            .catch(() => null),
          fetchApi<PaginatedResponse<SkillItem>>('/alumni-skill', { params: { limit: 5 } })
            .catch(() => null),
          fetchApi<any[]>('/success-stories/featured').catch(() => []),
        ])

      if (statsData) setStats(statsData)
      if (errors.length > 0) setFetchErrors(errors)
      if (Array.isArray(featuredData) && featuredData.length > 0) setFeaturedStories(featuredData)

      const items: FeedItem[] = []

      if (threadsData?.data) {
        for (const thread of threadsData.data) {
          items.push({
            id: `forum-${thread.id}`,
            type: 'forum',
            icon: '\u{1F4AC}',
            actorName: thread.author?.name || 'Seseorang',
            action: 'memulai diskusi',
            title: thread.title,
            href: `/forum/${thread.id}`,
            timestamp: thread.createdAt,
            metadata: { commentCount: thread.commentCount },
          })
        }
      }

      if (jobsData?.data) {
        for (const job of jobsData.data) {
          items.push({
            id: `jobs-${job.id}`,
            type: 'jobs',
            icon: '\u{1F4BC}',
            actorName: job.poster?.name || 'Seseorang',
            action: 'posting lowongan',
            title: job.title,
            description: job.tipe,
            href: job.linkExternal,
            timestamp: job.createdAt,
          })
        }
      }

      if (businessData?.data) {
        for (const biz of businessData.data) {
          items.push({
            id: `business-${biz.id}`,
            type: 'business',
            icon: '\u{1F3EA}',
            actorName: biz.alumniProfile?.user?.name || 'Seseorang',
            action: 'mendaftarkan usaha baru',
            title: biz.namaUsaha,
            description: biz.kategori,
            href: `/bisnis/${biz.id}`,
            timestamp: biz.createdAt,
            metadata: { kategori: biz.kategori },
          })
        }
      }

      if (successData?.data) {
        for (const story of successData.data) {
          items.push({
            id: `success-${story.id}`,
            type: 'success',
            icon: '\u{1F3C6}',
            actorName: 'Admin',
            action: 'menambahkan cerita sukses',
            title: story.name,
            description: story.achievement,
            href: '/sukses',
            timestamp: story.createdAt,
            metadata: { angkatan: story.angkatan },
          })
        }
      }

      if (skillData?.data) {
        for (const skill of skillData.data) {
          items.push({
            id: `skill-${skill.id}`,
            type: 'skill',
            icon: '\u{1F393}',
            actorName: skill.alumniProfile?.user?.name || 'Seseorang',
            action: 'menawarkan keahlian',
            title: skill.skill,
            description: skill.kategori,
            href: `/alumni-mengajar/${skill.id}`,
            timestamp: skill.createdAt,
            metadata: { kategori: skill.kategori },
          })
        }
      }

      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setFeedItems(items)
      setLoading(false)
    }

    fetchData()
  }, [])

  const displayedItems = useMemo(
    () => feedItems.slice(0, displayCount),
    [feedItems, displayCount],
  )

  const hasMore = displayCount < feedItems.length

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + FEED_PAGE_SIZE)
  }, [])

  const statItems = [
    {
      icon: '\u{1F465}',
      label: 'Total Alumni',
      value: stats?.total ?? 0,
      href: '/alumni',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      icon: '\u{1F4CB}',
      label: 'Forum',
      value: stats?.totalForumThreads ?? 0,
      href: '/forum',
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      icon: '\u{1F4BC}',
      label: 'Lowongan',
      value: stats?.totalJobs ?? 0,
      href: '/jobs',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      icon: '\u{1F3EA}',
      label: 'Bisnis',
      value: 0,
      href: '/bisnis',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  ]

  const discoverCards = [
    {
      icon: '\u{1F3EA}',
      title: 'Punya usaha?',
      description: 'Daftarkan di Direktori Bisnis',
      href: '/bisnis',
      bg: 'from-amber-50 to-amber-100',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: '\u{1F393}',
      title: 'Punya keahlian?',
      description: 'Bagikan di Alumni Mengajar',
      href: '/alumni-mengajar',
      bg: 'from-green-50 to-green-100',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: '\u{1F4BC}',
      title: 'Cari kerja?',
      description: 'Lihat lowongan terbaru',
      href: '/jobs',
      bg: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hai, {user?.name || 'Pengguna'}!
          </h1>
          <p className="text-sm text-gray-500">{t('app.tagline')}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto text-red-600 underline hover:text-red-800 shrink-0"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {fetchErrors.length > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <svg className="w-5 h-5 shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Beberapa data tidak dapat dimuat. Halaman tetap berfungsi.</span>
        </div>
      )}

      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari alumni, bisnis, forum..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          readOnly
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statItems.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <span className={`text-base ${stat.text}`}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 py-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Aktivitas Terbaru</h2>
            </div>
            {feedItems.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">{'\u{1F4AC}'}</div>
                <p className="text-gray-500 text-sm">Belum ada aktivitas terbaru</p>
                <p className="text-gray-400 text-xs mt-1">
                  Aktivitas dari forum, lowongan, bisnis, dan cerita sukses akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {displayedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.type === 'jobs' ? '_blank' : undefined}
                    rel={item.type === 'jobs' ? 'noopener noreferrer' : undefined}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{item.actorName}</span>{' '}
                          <span className="text-gray-500">{item.action}</span>
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400">{timeAgo(item.timestamp)}</span>
                          {item.metadata?.commentCount !== undefined && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                              </svg>
                              {item.metadata.commentCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {hasMore && (
              <div className="p-4 border-t border-gray-100 text-center">
                <button
                  onClick={handleLoadMore}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Muat Lainnya
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Kamu Mungkin Butuh</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {discoverCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-xl p-4 hover:shadow-md transition-all`}
                >
                  <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                    <span className={`text-lg ${card.iconColor}`}>{card.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {featuredStories.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{'\u{1F3C6}'}</span>
                  <h2 className="font-semibold text-gray-900">Alumni Berprestasi</h2>
                </div>
                <Link href="/sukses" className="text-xs text-amber-700 hover:text-amber-800 font-medium">
                  Lihat Semua &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {featuredStories.slice(0, 5).map((story) => (
                  <Link
                    key={story.id}
                    href="/sukses"
                    className="bg-white/80 backdrop-blur rounded-xl p-3 border border-amber-100 hover:shadow-md hover:bg-white transition-all text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm mx-auto mb-2 shadow-sm overflow-hidden">
                      {story.photoUrl ? (
                        <img src={story.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        story.name?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">{story.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">{story.achievement}</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-1">Angkatan {story.angkatan}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
