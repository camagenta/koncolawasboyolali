'use client'

import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

interface SkillItem {
  id: string
  skill: string
  kategori: string
  format: string
  level: string
  isActive: boolean
  alumniProfile: { user: { id: string; name: string } }
  createdAt: string
}

interface PaginatedSkills {
  data: SkillItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function AdminAlumniSkillPage() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [kategoriFilter, setKategoriFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<SkillItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchSkills = async (p: number, kategori?: string) => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page: p, limit: 20 }
      if (kategori) params.kategori = kategori
      const res = await fetchApi<PaginatedSkills>('/alumni-skill', { params })
      setSkills(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => {
    fetchSkills(1, kategoriFilter)
  }, [kategoriFilter])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetchApi(`/alumni-skill/${deleteTarget.id}`, { method: 'DELETE' })
      setSkills(prev => prev.filter(s => s.id !== deleteTarget.id))
      setTotal(t => t - 1)
      setToast({ message: 'Skill berhasil dihapus', type: 'success' })
      setDeleteTarget(null)
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const levelBadge = (val: string) => {
    const colors: Record<string, string> = { Pemula: 'bg-green-100 text-green-800', Menengah: 'bg-yellow-100 text-yellow-800', Lanjut: 'bg-red-100 text-red-800' }
    return colors[val] || 'bg-gray-100 text-gray-800'
  }

  const KATEGORI_OPTIONS = ['Teknologi & Programming', 'Bisnis & Kewirausahaan', 'Keuangan & Akuntansi', 'Kesehatan & Farmasi', 'Hukum & Regulasi', 'Pendidikan & Pelatihan', 'Kreatif & Desain', 'Komunikasi & Public Speaking', 'Pertanian & Pangan', 'Teknik & Manufaktur', 'Lainnya']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alumni Skill</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar skill yang ditawarkan alumni</p>
        </div>
      </div>

      {toast && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.message}
          <button onClick={() => setToast(null)} className="float-right text-inherit opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Filter Kategori:</label>
            <select
              value={kategoriFilter}
              onChange={e => setKategoriFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="text-sm text-gray-400 ml-auto">{total} skill</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : skills.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">Belum ada skill terdaftar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Skill</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Format</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tingkat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Alumni</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {skills.map(skill => (
                  <tr key={skill.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{skill.kategori}</td>
                    <td className="px-4 py-3 text-gray-600">{skill.format}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelBadge(skill.level)}`}>
                        {skill.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{skill.alumniProfile?.user?.name || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        skill.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {skill.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setDeleteTarget(skill)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Hapus"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <button
              onClick={() => fetchSkills(page - 1, kategoriFilter)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-500">Halaman {page} dari {totalPages}</span>
            <button
              onClick={() => fetchSkills(page + 1, kategoriFilter)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Skill</h3>
            <p className="text-sm text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus skill &ldquo;{deleteTarget.skill}&rdquo;?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
