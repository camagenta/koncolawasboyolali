'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

const SKILL_KATEGORI = ['Teknologi & Programming', 'Bisnis & Kewirausahaan', 'Keuangan & Akuntansi', 'Kesehatan & Farmasi', 'Hukum & Regulasi', 'Pendidikan & Pelatihan', 'Kreatif & Desain', 'Komunikasi & Public Speaking', 'Pertanian & Pangan', 'Teknik & Manufaktur', 'Lainnya']
const SKILL_FORMAT = ['Workshop', 'Seminar', 'Webinar', 'Pelatihan', 'Mentoring']
const SKILL_LEVEL = ['Pemula', 'Menengah', 'Lanjut']

interface SkillDetail {
  id: string
  skill: string
  deskripsi?: string
  kategori: string
  format: string
  level: string
  durasi?: string
  ketersediaan: string
  isActive: boolean
  alumniProfile: {
    user: { id: string; name: string; avatarUrl?: string }
  }
  createdAt: string
  updatedAt: string
}

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { user } = useAuth()

  const [skill, setSkill] = useState<SkillDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ skill: '', deskripsi: '', kategori: '', format: 'Mentoring', level: 'Pemula', durasi: '', ketersediaan: 'online' })
  const [editSaving, setEditSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isOwner = user && skill?.alumniProfile?.user?.id === user.id

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    fetchApi<SkillDetail>(`/alumni-skill/${id}`)
      .then(setSkill)
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat detail skill'))
      .finally(() => setLoading(false))
  }, [id])

  const openEditModal = () => {
    if (!skill) return
    setEditForm({
      skill: skill.skill,
      deskripsi: skill.deskripsi ?? '',
      kategori: skill.kategori,
      format: skill.format,
      level: skill.level,
      durasi: skill.durasi ?? '',
      ketersediaan: skill.ketersediaan,
    })
    setEditModal(true)
  }

  const saveEdit = async () => {
    setEditSaving(true)
    try {
      const body: Record<string, any> = {}
      for (const [key, value] of Object.entries(editForm)) {
        if (value !== '') body[key] = value
      }
      const updated = await fetchApi(`/alumni-skill/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
      setSkill((prev) => prev ? { ...prev, ...updated } : prev)
      setEditModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui skill')
    } finally {
      setEditSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await fetchApi(`/alumni-skill/${id}`, { method: 'DELETE' })
      router.push('/alumni-mengajar')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus skill')
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatLabel = (val: string) => {
    const map: Record<string, string> = { Workshop: 'Workshop', Seminar: 'Seminar', Webinar: 'Webinar', Pelatihan: 'Pelatihan', Mentoring: 'Mentoring' }
    return map[val] || val
  }

  const levelBadge = (val: string) => {
    const colors: Record<string, string> = { Pemula: 'bg-green-100 text-green-800', Menengah: 'bg-yellow-100 text-yellow-800', Lanjut: 'bg-red-100 text-red-800' }
    return colors[val] || 'bg-gray-100 text-gray-800'
  }

  const availabilityIcon = (val: string) => {
    if (val === 'online') return '\u{1F310}'
    if (val === 'offline') return '\u{1F3E2}'
    return '\u{1F517}'
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-40 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-2">Gagal Memuat Data</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={() => router.push('/alumni-mengajar')} className="text-sm text-red-600 underline hover:text-red-800">
            Kembali ke direktori
          </button>
        </div>
      </div>
    )
  }

  if (!skill) return null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/alumni-mengajar" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke direktori
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {skill.kategori}
                </span>
                {!skill.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Tidak Aktif
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{skill.skill}</h1>
              {skill.deskripsi && (
                <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">{skill.deskripsi}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isOwner && (
                <>
                  <button onClick={openEditModal} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Format</p>
            <p className="text-sm font-medium text-gray-900">{formatLabel(skill.format)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Tingkat</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelBadge(skill.level)}`}>
              {skill.level}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Ketersediaan</p>
            <p className="text-sm font-medium text-gray-900">
              {availabilityIcon(skill.ketersediaan)} {skill.ketersediaan === 'online' ? 'Online' : skill.ketersediaan === 'offline' ? 'Offline' : 'Hybrid'}
            </p>
          </div>
          {skill.durasi && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Durasi</p>
              <p className="text-sm font-medium text-gray-900">{skill.durasi}</p>
            </div>
          )}
        </div>

        {/* Owner Profile */}
        <div className="p-6 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Ditawarkan oleh</p>
          <Link href={`/alumni/${skill.alumniProfile.user.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 overflow-hidden">
              {skill.alumniProfile.user.avatarUrl ? (
                <img src={skill.alumniProfile.user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                skill.alumniProfile.user.name?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{skill.alumniProfile.user.name}</p>
              <p className="text-xs text-gray-400">Lihat profil lengkap</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Edit Skill</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Skill <span className="text-red-500">*</span></label>
                <input value={editForm.skill} onChange={e => setEditForm(p => ({ ...p, skill: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                <select value={editForm.kategori} onChange={e => setEditForm(p => ({ ...p, kategori: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {SKILL_KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={editForm.deskripsi} onChange={e => setEditForm(p => ({ ...p, deskripsi: e.target.value }))} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select value={editForm.format} onChange={e => setEditForm(p => ({ ...p, format: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {SKILL_FORMAT.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
                  <select value={editForm.level} onChange={e => setEditForm(p => ({ ...p, level: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {SKILL_LEVEL.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                  <input value={editForm.durasi} onChange={e => setEditForm(p => ({ ...p, durasi: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2 jam, 1 hari, ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ketersediaan</label>
                  <select value={editForm.ketersediaan} onChange={e => setEditForm(p => ({ ...p, ketersediaan: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
              <button onClick={saveEdit} disabled={editSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {editSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Skill</h3>
            <p className="text-sm text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus skill &ldquo;{skill?.skill}&rdquo;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
                {deleteLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
