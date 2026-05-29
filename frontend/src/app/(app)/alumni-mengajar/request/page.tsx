'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchApi } from '@/lib/api'

const KATEGORI = ['Teknologi', 'Bisnis', 'Kesehatan', 'Kreatif', 'Pendidikan', 'Bahasa', 'Olahraga', 'Seni', 'Lainnya']
const FORMATS = ['Workshop', 'Seminar', 'Webinar', 'Pelatihan', 'Mentoring']

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {message}
    </div>
  )
}

export default function RequestSkillPage() {
  const router = useRouter()
  const [kategori, setKategori] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [format, setFormat] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deskripsi.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const body: Record<string, string> = { deskripsi: deskripsi.trim() }
      if (kategori) body.kategori = kategori
      if (format) body.format = format
      await fetchApi('/alumni-skill/requests', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setToast({ message: 'Permintaan berhasil dikirim', type: 'success' })
      setTimeout(() => router.push('/alumni-mengajar'), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim permintaan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minta Keahlian</h1>
        <p className="text-sm text-gray-500 mt-0.5">Butuh keahlian tertentu? Beritahu alumni lain</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Kebutuhan <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Jelaskan keahlian apa yang kamu butuhkan..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format yang Diinginkan</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua Format</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting || !deskripsi.trim()}
          className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Mengirim...' : 'Kirim Permintaan'}
        </button>
      </form>
    </div>
  )
}
