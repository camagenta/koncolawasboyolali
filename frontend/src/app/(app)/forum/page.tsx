'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { fetchApi, type Category, type Thread, type PaginatedResponse } from '@/lib/api'
import { timeAgo } from '@/lib/timeago'

export default function ForumPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApi<Category[]>('/forums/categories')
      .then(setCategories)
      .catch(() => {})
  }, [])

  const fetchThreads = async (pageNum: number, append = false) => {
    try {
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError('')

      const res = await fetchApi<PaginatedResponse<Thread>>('/forums/threads', {
        params: {
          categoryId: activeCategory || null,
          page: pageNum,
          limit: 10,
        },
      })

      if (append) {
        setThreads((prev) => [...prev, ...res.data])
      } else {
        setThreads(res.data)
      }
      setTotalPages(res.totalPages)
      setPage(pageNum)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchThreads(1)
  }, [activeCategory])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.forum')}</h1>
        <Link
          href="/forum/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('forum.new_thread')}
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('')}
          className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            !activeCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('forum.all_categories')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading && threads.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>
      ) : threads.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>{t('forum.no_threads')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${thread.id}`}
                className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.isPinned && (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>
                          {t('forum.pinned')}
                        </span>
                      )}
                      {categories.find((c) => c.id === thread.categoryId) && (
                        <span className="shrink-0 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {categories.find((c) => c.id === thread.categoryId)?.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 truncate">{thread.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{thread.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[10px]">
                          {thread.author.name.charAt(0).toUpperCase()}
                        </div>
                        {thread.author.name}
                      </span>
                      <span>{timeAgo(thread.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {thread.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                    {t('common.loading')}
                  </span>
                ) : (
                  t('forum.load_more')
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  function handleLoadMore() {
    if (page < totalPages) fetchThreads(page + 1, true)
  }
}
