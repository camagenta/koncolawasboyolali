'use client'

import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'

interface SuccessStory {
  id: string
  name: string
  angkatan: number
  photoUrl?: string
  achievement: string
  description?: string
  isFeatured: boolean
  userId?: string
  createdAt: string
  updatedAt: string
}

export default function SuksesPage() {
  const { t } = useTranslation()
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<SuccessStory | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetchApi<{ data: SuccessStory[] }>('/success-stories', { params: { page: 1, limit: 50 } })
        setStories(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat cerita sukses')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alumni Berprestasi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Cerita sukses dari alumni SMAN 1 Boyolali</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" /><path d="M4 22h16" /><path d="M10 22V12" /><path d="M14 22V12" /><path d="M12 7V4" /><path d="M10 4h4" />
          </svg>
          <p className="text-gray-500 text-sm">Belum ada cerita sukses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelected(story)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                {story.photoUrl ? (
                  <img
                    src={story.photoUrl}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">{story.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Angkatan {story.angkatan}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{story.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Detail Cerita Sukses</h2>
              <button onClick={() => setSelected(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center">
                {selected.photoUrl ? (
                  <img src={selected.photoUrl} alt={selected.name} className="w-20 h-20 rounded-full object-cover mb-4" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{selected.name}</h3>
                <p className="text-sm text-gray-500">Angkatan {selected.angkatan}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Prestasi</h4>
                <p className="text-sm text-gray-600">{selected.achievement}</p>
              </div>
              {selected.description && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cerita Lengkap</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{selected.description}</p>
                </div>
              )}
              {selected.userId && (
                <a
                  href={`/alumni/${selected.userId}`}
                  className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Lihat Profil Lengkap →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
