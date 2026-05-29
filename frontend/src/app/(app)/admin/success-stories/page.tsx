'use client'

import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

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

interface FormData {
  name: string
  angkatan: number
  achievement: string
  description: string
  photoUrl: string
  isFeatured: boolean
}

const emptyForm: FormData = { name: '', angkatan: new Date().getFullYear(), achievement: '', description: '', photoUrl: '', isFeatured: false }

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<SuccessStory | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchStories = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchApi<{ data: SuccessStory[]; total: number; page: number; limit: number; totalPages: number }>('/success-stories', { params: { page: 1, limit: 100 } })
      setStories(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat cerita sukses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStories() }, [])

  const openCreate = () => {
    setEditing(null)
    setFormData(emptyForm)
    setShowModal(true)
  }

  const openEdit = (story: SuccessStory) => {
    setEditing(story)
    setFormData({
      name: story.name,
      angkatan: story.angkatan,
      achievement: story.achievement,
      description: story.description || '',
      photoUrl: story.photoUrl || '',
      isFeatured: story.isFeatured,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.achievement.trim()) return
    setSubmitting(true)
    try {
      const body = {
        name: formData.name,
        angkatan: formData.angkatan,
        achievement: formData.achievement,
        description: formData.description || undefined,
        photoUrl: formData.photoUrl || undefined,
        isFeatured: formData.isFeatured,
      }
      if (editing) {
        await fetchApi(`/admin/success-stories/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      } else {
        await fetchApi('/admin/success-stories', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }
      setShowModal(false)
      fetchStories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan cerita sukses')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (story: SuccessStory) => {
    if (!confirm(`Hapus cerita sukses "${story.name}"?`)) return
    try {
      await fetchApi(`/admin/success-stories/${story.id}`, { method: 'DELETE' })
      fetchStories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus cerita sukses')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Cerita Sukses</h2>
          <p className="text-sm text-gray-500 mt-0.5">Kelola cerita sukses alumni</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Cerita
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-400 text-sm">Belum ada cerita sukses</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Angkatan</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Prestasi</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Featured</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {story.photoUrl ? (
                        <img src={story.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{story.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{story.angkatan}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{story.achievement}</td>
                  <td className="px-4 py-3 text-center">
                    {story.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(story)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(story)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? 'Edit Cerita Sukses' : 'Tambah Cerita Sukses'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan *</label>
                <input type="number" required value={formData.angkatan} onChange={(e) => setFormData(prev => ({ ...prev, angkatan: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prestasi *</label>
                <input type="text" required value={formData.achievement} onChange={(e) => setFormData(prev => ({ ...prev, achievement: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cerita Lengkap</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto</label>
                <input type="url" value={formData.photoUrl} onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))} placeholder="https://" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Tampilkan sebagai Featured
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
