'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'

type Tab = 'data-diri' | 'pendidikan' | 'karir' | 'usaha'

interface ProfileData {
  id: string
  userId: string
  namaLengkap?: string
  fotoProfil?: string
  noHp?: string
  tahunMasuk?: number
  tahunLulus?: number
  jurusan?: string
  kelas1?: string
  kelas2?: string
  kelas3?: string
  kotaDomisili?: string
  kecamatanAsalBoyolali?: string
  alamatLengkap?: string
  linkLinkedin?: string
  linkInstagram?: string
  statusUtama?: string
  educations?: Education[]
  careers?: Career[]
  user?: { id: string; name: string; email: string; avatarUrl?: string }
}

interface Education {
  id: string
  jenjang: string
  institusi: string
  jurusan?: string
  tahunMasuk?: number
  tahunLulus?: number
  status: string
}

interface Career {
  id: string
  perusahaan: string
  jabatan: string
  sektorIndustri?: string
  tahunMulai?: number
  tahunSelesai?: number
  kotaPenempatan?: string
  status: string
}

const JENJANG_OPTIONS = ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3']
const SEKTOR_OPTIONS = [
  'Pemerintahan', 'Pendidikan', 'Kesehatan', 'Teknologi Informasi',
  'Keuangan/Perbankan', 'Manufaktur', 'Konsultan', 'Wirausaha',
  'Media/Entertainment', 'Pertambangan/Energi', 'Pertanian',
  'Transportasi/Logistik', 'Property/Konstruksi', 'F&B/Hospitality',
  'Organisasi Non-Profit', 'Lainnya',
]

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
}

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

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {children}
      </div>
    </div>
  )
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder, options, required }: {
  label: string; type?: string; value: string | number | undefined; onChange: (v: string) => void
  placeholder?: string; options?: { label: string; value: string }[]; required?: boolean
}) {
  const val = value ?? ''
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
        <select
          value={val}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih {label}</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={val}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('data-diri')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [educations, setEducations] = useState<Education[]>([])
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [form, setForm] = useState({
    namaLengkap: '', noHp: '', tahunMasuk: '', tahunLulus: '',
    jurusan: '', kelas1: '', kelas2: '', kelas3: '', kotaDomisili: '', kecamatanAsalBoyolali: '',
    alamatLengkap: '', linkLinkedin: '', linkInstagram: '', statusUtama: '',
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const [bukuIndukQuery, setBukuIndukQuery] = useState('')
  const [bukuIndukResults, setBukuIndukResults] = useState<any[]>([])
  const [bukuIndukLoading, setBukuIndukLoading] = useState(false)
  const [showBukuInduk, setShowBukuInduk] = useState(false)
  const bukuIndukRef = useRef<HTMLDivElement>(null)

  const [eduModal, setEduModal] = useState(false)
  const [eduForm, setEduForm] = useState({ jenjang: '', institusi: '', jurusan: '', tahunMasuk: '', tahunLulus: '', status: '' })
  const [editingEduId, setEditingEduId] = useState<string | null>(null)
  const [deleteEduTarget, setDeleteEduTarget] = useState<Education | null>(null)

  const [careerModal, setCareerModal] = useState(false)
  const [careerForm, setCareerForm] = useState({ perusahaan: '', jabatan: '', sektorIndustri: '', tahunMulai: '', tahunSelesai: '', kotaPenempatan: '', status: '' })
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null)
  const [deleteCareerTarget, setDeleteCareerTarget] = useState<Career | null>(null)

  // Business listings
  const [businesses, setBusinesses] = useState<any[]>([])
  const [businessesLoading, setBusinessesLoading] = useState(false)
  const [businessModal, setBusinessModal] = useState(false)
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null)
  const [deleteBusinessTarget, setDeleteBusinessTarget] = useState<any | null>(null)
  const [businessForm, setBusinessForm] = useState({
    namaUsaha: '', deskripsi: '', kategori: '', kontak: '', website: '', instagram: '', alamat: '', cariMitra: false,
  })
  const [businessSaving, setBusinessSaving] = useState(false)
  const BUSINESS_KATEGORI = ['Kuliner', 'Fashion', 'Teknologi', 'Pendidikan', 'Kesehatan', 'Pertanian', 'Kerajinan', 'Jasa', 'Properti', 'Otomotif', 'Media & Kreatif', 'Lainnya']

  const tabs: { key: Tab; label: string }[] = [
    { key: 'data-diri', label: 'Data Diri' },
    { key: 'pendidikan', label: 'Riwayat Pendidikan' },
    { key: 'karir', label: 'Riwayat Karir' },
    { key: 'usaha', label: 'Usaha Saya' },
  ]

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }, [])

  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchApi('/alumni/profiles/me')
      setProfile(data)
      setForm({
        namaLengkap: data.namaLengkap ?? '',
        noHp: data.noHp ?? '',
        tahunMasuk: data.tahunMasuk?.toString() ?? '',
        tahunLulus: data.tahunLulus?.toString() ?? '',
        jurusan: data.jurusan ?? '',
        kelas1: data.kelas1 ?? '',
        kelas2: data.kelas2 ?? '',
        kelas3: data.kelas3 ?? '',
        kotaDomisili: data.kotaDomisili ?? '',
        kecamatanAsalBoyolali: data.kecamatanAsalBoyolali ?? '',
        alamatLengkap: data.alamatLengkap ?? '',
        linkLinkedin: data.linkLinkedin ?? '',
        linkInstagram: data.linkInstagram ?? '',
        statusUtama: data.statusUtama ?? '',
      })
      if (data.educations) setEducations(data.educations)
      if (data.careers) setCareers(data.careers)
    } catch (err: any) {
      // 404 means no profile yet — that's fine, user will create one
      if (err.message !== 'Profil alumni tidak ditemukan') {
        showToast(err.message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadProfile() }, [loadProfile])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const body: Record<string, any> = {}
      for (const [key, value] of Object.entries(form)) {
        if (value !== '') {
          body[key] = key === 'tahunMasuk' || key === 'tahunLulus' ? Number(value) : value
        }
      }
      const method = profile ? 'PUT' : 'POST'
      const updated = await fetchApi('/alumni/profiles/me', {
        method,
        body: JSON.stringify(body),
      })
      setProfile(updated)
      showToast('Profil berhasil disimpan', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const uploadPhoto = async (file: File) => {
    const maxSize = 2 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showToast('File harus berupa gambar (JPEG, PNG, atau WebP)', 'error')
      return
    }
    if (file.size > maxSize) {
      showToast('Ukuran file maksimal 2MB', 'error')
      return
    }
    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const updated = await fetchApi('/alumni/profiles/me/photo', {
        method: 'POST',
        body: formData,
      })
      setProfile(prev => prev ? { ...prev, fotoProfil: updated.fotoProfil } : null)
      setPhotoPreview(null)
      showToast('Foto profil berhasil diupload', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setPhotoUploading(false)
    }
  }

  const searchBukuInduk = useCallback(async (q: string) => {
    if (q.length < 2) { setBukuIndukResults([]); return }
    setBukuIndukLoading(true)
    try {
      const data = await fetchApi(`/import/buku-induk/search?q=${encodeURIComponent(q)}`)
      setBukuIndukResults(Array.isArray(data) ? data : data.data ?? [])
    } catch { /* ignore */ }
    setBukuIndukLoading(false)
  }, [])

  let bukuIndukTimer: ReturnType<typeof setTimeout>
  const handleBukuIndukChange = (v: string) => {
    setBukuIndukQuery(v)
    setShowBukuInduk(true)
    clearTimeout(bukuIndukTimer)
    bukuIndukTimer = setTimeout(() => searchBukuInduk(v), 300)
  }

  const selectBukuInduk = (item: any) => {
    setForm(prev => ({
      ...prev,
      namaLengkap: item.namaLengkap ?? item.nama ?? prev.namaLengkap,
      noHp: item.noHp ?? prev.noHp,
      tahunMasuk: item.tahunMasuk?.toString() ?? prev.tahunMasuk,
      jurusan: item.jurusan ?? prev.jurusan,
      kelas3: item.kelas3 ?? prev.kelas3,
      alamatLengkap: item.alamat ?? prev.alamatLengkap,
    }))
    setBukuIndukQuery(item.namaLengkap ?? item.nama ?? '')
    setShowBukuInduk(false)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bukuIndukRef.current && !bukuIndukRef.current.contains(e.target as Node)) {
        setShowBukuInduk(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const openEduModal = (edu?: Education) => {
    if (edu) {
      setEduForm({
        jenjang: edu.jenjang,
        institusi: edu.institusi,
        jurusan: edu.jurusan ?? '',
        tahunMasuk: edu.tahunMasuk?.toString() ?? '',
        tahunLulus: edu.tahunLulus?.toString() ?? '',
        status: edu.status,
      })
      setEditingEduId(edu.id)
    } else {
      setEduForm({ jenjang: '', institusi: '', jurusan: '', tahunMasuk: '', tahunLulus: '', status: '' })
      setEditingEduId(null)
    }
    setEduModal(true)
  }

  const saveEducation = async () => {
    try {
      const body: Record<string, any> = {}
      for (const [key, value] of Object.entries(eduForm)) {
        if (value !== '') {
          body[key] = key === 'tahunMasuk' || key === 'tahunLulus' ? Number(value) : value
        }
      }
      if (editingEduId) {
        const updated = await fetchApi(`/alumni/educations/${editingEduId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        setEducations(prev => prev.map(e => e.id === editingEduId ? { ...e, ...updated } : e))
        showToast('Pendidikan berhasil diupdate', 'success')
      } else {
        const created = await fetchApi('/alumni/educations', {
          method: 'POST',
          body: JSON.stringify(body),
        })
        setEducations(prev => [...prev, created])
        showToast('Pendidikan berhasil ditambahkan', 'success')
      }
      setEduModal(false)
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  const deleteEducation = async () => {
    if (!deleteEduTarget) return
    try {
      await fetchApi(`/alumni/educations/${deleteEduTarget.id}`, { method: 'DELETE' })
      setEducations(prev => prev.filter(e => e.id !== deleteEduTarget.id))
      showToast('Pendidikan berhasil dihapus', 'success')
      setDeleteEduTarget(null)
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  const openCareerModal = (car?: Career) => {
    if (car) {
      setCareerForm({
        perusahaan: car.perusahaan,
        jabatan: car.jabatan,
        sektorIndustri: car.sektorIndustri ?? '',
        tahunMulai: car.tahunMulai?.toString() ?? '',
        tahunSelesai: car.tahunSelesai?.toString() ?? '',
        kotaPenempatan: car.kotaPenempatan ?? '',
        status: car.status,
      })
      setEditingCareerId(car.id)
    } else {
      setCareerForm({ perusahaan: '', jabatan: '', sektorIndustri: '', tahunMulai: '', tahunSelesai: '', kotaPenempatan: '', status: '' })
      setEditingCareerId(null)
    }
    setCareerModal(true)
  }

  const saveCareer = async () => {
    try {
      const body: Record<string, any> = {}
      for (const [key, value] of Object.entries(careerForm)) {
        if (value !== '') {
          body[key] = key === 'tahunMulai' || key === 'tahunSelesai' ? Number(value) : value
        }
      }
      if (editingCareerId) {
        const updated = await fetchApi(`/alumni/careers/${editingCareerId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        setCareers(prev => prev.map(c => c.id === editingCareerId ? { ...c, ...updated } : c))
        showToast('Karir berhasil diupdate', 'success')
      } else {
        const created = await fetchApi('/alumni/careers', {
          method: 'POST',
          body: JSON.stringify(body),
        })
        setCareers(prev => [...prev, created])
        showToast('Karir berhasil ditambahkan', 'success')
      }
      setCareerModal(false)
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  const deleteCareer = async () => {
    if (!deleteCareerTarget) return
    try {
      await fetchApi(`/alumni/careers/${deleteCareerTarget.id}`, { method: 'DELETE' })
      setCareers(prev => prev.filter(c => c.id !== deleteCareerTarget.id))
      showToast('Karir berhasil dihapus', 'success')
      setDeleteCareerTarget(null)
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  const fetchBusinesses = useCallback(async () => {
    setBusinessesLoading(true)
    try {
      const data = await fetchApi<any>('/business/mine')
      setBusinesses(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
    setBusinessesLoading(false)
  }, [])

  useEffect(() => {
    if (activeTab === 'usaha' && businesses.length === 0 && !businessesLoading) {
      fetchBusinesses()
    }
  }, [activeTab, businesses.length, businessesLoading, fetchBusinesses])

  const openBusinessModal = (biz?: any) => {
    if (biz) {
      setBusinessForm({
        namaUsaha: biz.namaUsaha ?? '',
        deskripsi: biz.deskripsi ?? '',
        kategori: biz.kategori ?? '',
        kontak: biz.kontak ?? '',
        website: biz.website ?? '',
        instagram: biz.instagram ?? '',
        alamat: biz.alamat ?? '',
        cariMitra: biz.isCariMitra ?? biz.cariMitra ?? false,
      })
      setEditingBusinessId(biz.id)
    } else {
      setBusinessForm({ namaUsaha: '', deskripsi: '', kategori: '', kontak: '', website: '', instagram: '', alamat: '', cariMitra: false })
      setEditingBusinessId(null)
    }
    setBusinessModal(true)
  }

  const saveBusiness = async () => {
    setBusinessSaving(true)
    try {
      const body: Record<string, any> = {}
      for (const [key, value] of Object.entries(businessForm)) {
        if (value !== '' && value !== false) body[key] = value
        if (key === 'cariMitra') body[key] = value
      }
      if (editingBusinessId) {
        await fetchApi(`/business/${editingBusinessId}`, { method: 'PATCH', body: JSON.stringify(body) })
        showToast('Bisnis berhasil diperbarui', 'success')
      } else {
        await fetchApi('/business', { method: 'POST', body: JSON.stringify(body) })
        showToast('Bisnis berhasil didaftarkan', 'success')
      }
      setBusinessModal(false)
      fetchBusinesses()
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setBusinessSaving(false)
    }
  }

  const deleteBusiness = async () => {
    if (!deleteBusinessTarget) return
    try {
      await fetchApi(`/business/${deleteBusinessTarget.id}`, { method: 'DELETE' })
      setBusinesses(prev => prev.filter((b: any) => b.id !== deleteBusinessTarget.id))
      showToast('Bisnis berhasil dihapus', 'success')
      setDeleteBusinessTarget(null)
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {(!form.tahunMasuk || !form.tahunLulus) && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-yellow-800">
              Lengkapi data tahun masuk dan tahun lulus untuk mengakses fitur lainnya.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
          {profile?.user?.email && (
            <p className="text-sm text-gray-500 mt-1">Masuk sebagai {profile.user.email}</p>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'data-diri' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto Profil</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : profile?.fotoProfil ? (
                  <img src={`${API_URL}${profile.fotoProfil}`} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : profile?.user?.avatarUrl ? (
                  <img src={profile.user.avatarUrl} alt="Foto Google" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                {photoUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Upload Foto
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={photoUploading}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPhotoPreview(URL.createObjectURL(file))
                      uploadPhoto(file)
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cari Data dari Buku Induk</h2>
            <p className="text-sm text-gray-500 mb-3">Cari nama untuk mengisi data diri secara otomatis</p>
            <div className="relative" ref={bukuIndukRef}>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={bukuIndukQuery}
                  onChange={e => handleBukuIndukChange(e.target.value)}
                  onFocus={() => setShowBukuInduk(true)}
                  placeholder="Cari nama alumni..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {bukuIndukLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
              {showBukuInduk && bukuIndukResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {bukuIndukResults.map((item, i) => (
                    <button
                      key={item.id ?? i}
                      onClick={() => selectBukuInduk(item)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-900">{item.namaLengkap ?? item.nama}</span>
                      {item.jurusan && <span className="text-gray-500 ml-2">- {item.jurusan}</span>}
                      {item.tahunMasuk && <span className="text-gray-400 ml-2">({item.tahunMasuk})</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Diri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nama Lengkap" value={form.namaLengkap} onChange={v => setForm(p => ({ ...p, namaLengkap: v }))} required />
              <InputField label="No. HP" type="tel" value={form.noHp} onChange={v => setForm(p => ({ ...p, noHp: v }))} placeholder="08xxxxxxxxxx" />
              <InputField label="Tahun Masuk" type="number" value={form.tahunMasuk} onChange={v => setForm(p => ({ ...p, tahunMasuk: v }))} required />
              <InputField label="Tahun Lulus" type="number" value={form.tahunLulus} onChange={v => setForm(p => ({ ...p, tahunLulus: v }))} required />
              <InputField label="Jurusan" value={form.jurusan} onChange={v => setForm(p => ({ ...p, jurusan: v }))} placeholder="IPA/IPS/Bahasa" />
              <InputField label="Kelas 1" value={form.kelas1} onChange={v => setForm(p => ({ ...p, kelas1: v }))} placeholder="1.4" />
              <InputField label="Kelas 2" value={form.kelas2} onChange={v => setForm(p => ({ ...p, kelas2: v }))} placeholder="2.4" />
              <InputField label="Kelas 3" value={form.kelas3} onChange={v => setForm(p => ({ ...p, kelas3: v }))} placeholder="III IPA 1" />
              <InputField label="Kota Domisili" value={form.kotaDomisili} onChange={v => setForm(p => ({ ...p, kotaDomisili: v }))} />
              <InputField label="Kecamatan Asal (Boyolali)" value={form.kecamatanAsalBoyolali} onChange={v => setForm(p => ({ ...p, kecamatanAsalBoyolali: v }))} />
              <div className="md:col-span-2">
                <InputField label="Alamat Lengkap" value={form.alamatLengkap} onChange={v => setForm(p => ({ ...p, alamatLengkap: v }))} />
              </div>
              <InputField label="LinkedIn URL" type="url" value={form.linkLinkedin} onChange={v => setForm(p => ({ ...p, linkLinkedin: v }))} placeholder="https://linkedin.com/in/..." />
              <InputField label="Instagram URL" type="url" value={form.linkInstagram} onChange={v => setForm(p => ({ ...p, linkInstagram: v }))} placeholder="https://instagram.com/..." />
              <InputField
                label="Status Utama"
                value={form.statusUtama}
                onChange={v => setForm(p => ({ ...p, statusUtama: v }))}
                options={[
                  { label: 'Bekerja', value: 'Bekerja' },
                  { label: 'Kuliah', value: 'Kuliah' },
                  { label: 'Wirausaha', value: 'Wirausaha' },
                  { label: 'Belum Bekerja', value: 'Belum Bekerja' },
                  { label: 'Lainnya', value: 'Lainnya' },
                ]}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pendidikan' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Pendidikan</h2>
            <button
              onClick={() => openEduModal()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Tambah Pendidikan
            </button>
          </div>

          {educations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500 text-sm">Belum ada data pendidikan. Klik tombol di atas untuk menambahkan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...educations].sort((a, b) => {
                const order = ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3']
                return (order.indexOf(a.jenjang) - order.indexOf(b.jenjang)) || (b.tahunMasuk ?? 0) - (a.tahunMasuk ?? 0)
              }).map(edu => (
                <div key={edu.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {edu.jenjang}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{edu.institusi}</span>
                    </div>
                    {edu.jurusan && <p className="text-sm text-gray-600">{edu.jurusan}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {edu.tahunMasuk && `${edu.tahunMasuk}`}{edu.tahunMasuk && edu.tahunLulus ? ' - ' : ''}{edu.tahunLulus && `${edu.tahunLulus}`}
                      <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                        edu.status === 'Lulus' ? 'bg-green-100 text-green-800' :
                        edu.status === 'Tidak Lulus' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {edu.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEduModal(edu)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => setDeleteEduTarget(edu)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal open={eduModal} onClose={() => setEduModal(false)}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingEduId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang <span className="text-red-500">*</span></label>
                <select
                  value={eduForm.jenjang}
                  onChange={e => setEduForm(p => ({ ...p, jenjang: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Jenjang</option>
                  {JENJANG_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <InputField label="Institusi" value={eduForm.institusi} onChange={v => setEduForm(p => ({ ...p, institusi: v }))} required />
              <InputField label="Jurusan" value={eduForm.jurusan} onChange={v => setEduForm(p => ({ ...p, jurusan: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Tahun Masuk" type="number" value={eduForm.tahunMasuk} onChange={v => setEduForm(p => ({ ...p, tahunMasuk: v }))} />
                <InputField label="Tahun Lulus" type="number" value={eduForm.tahunLulus} onChange={v => setEduForm(p => ({ ...p, tahunLulus: v }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  value={eduForm.status}
                  onChange={e => setEduForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Tidak Lulus">Tidak Lulus</option>
                  <option value="Sedang">Sedang</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEduModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Batal
              </button>
              <button onClick={saveEducation} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                {editingEduId ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </Modal>

          <ConfirmDialog
            open={!!deleteEduTarget}
            title="Hapus Pendidikan"
            message={`Apakah Anda yakin ingin menghapus data pendidikan ${deleteEduTarget?.jenjang} di ${deleteEduTarget?.institusi}?`}
            onConfirm={deleteEducation}
            onCancel={() => setDeleteEduTarget(null)}
          />
        </div>
      )}

      {activeTab === 'karir' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Karir</h2>
            <button
              onClick={() => openCareerModal()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Tambah Karir
            </button>
          </div>

          {careers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500 text-sm">Belum ada data karir. Klik tombol di atas untuk menambahkan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...careers].sort((a, b) => (b.tahunMulai ?? 0) - (a.tahunMulai ?? 0)).map(car => (
                <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{car.jabatan}</span>
                      <span className="text-sm text-gray-500">di</span>
                      <span className="text-sm font-semibold text-blue-600">{car.perusahaan}</span>
                    </div>
                    {car.sektorIndustri && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {car.sektorIndustri}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {car.tahunMulai && `${car.tahunMulai}`}{car.tahunMulai && car.tahunSelesai ? ' - ' : ''}{car.tahunSelesai && `${car.tahunSelesai}`}
                      {car.kotaPenempatan && ` | ${car.kotaPenempatan}`}
                      <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                        car.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {car.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openCareerModal(car)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => setDeleteCareerTarget(car)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal open={careerModal} onClose={() => setCareerModal(false)}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCareerId ? 'Edit Karir' : 'Tambah Karir'}
            </h3>
            <div className="space-y-4">
              <InputField label="Perusahaan" value={careerForm.perusahaan} onChange={v => setCareerForm(p => ({ ...p, perusahaan: v }))} required />
              <InputField label="Jabatan" value={careerForm.jabatan} onChange={v => setCareerForm(p => ({ ...p, jabatan: v }))} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sektor Industri</label>
                <select
                  value={careerForm.sektorIndustri}
                  onChange={e => setCareerForm(p => ({ ...p, sektorIndustri: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Sektor</option>
                  {SEKTOR_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Tahun Mulai" type="number" value={careerForm.tahunMulai} onChange={v => setCareerForm(p => ({ ...p, tahunMulai: v }))} />
                <InputField label="Tahun Selesai" type="number" value={careerForm.tahunSelesai} onChange={v => setCareerForm(p => ({ ...p, tahunSelesai: v }))} />
              </div>
              <InputField label="Kota Penempatan" value={careerForm.kotaPenempatan} onChange={v => setCareerForm(p => ({ ...p, kotaPenempatan: v }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                <select
                  value={careerForm.status}
                  onChange={e => setCareerForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setCareerModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Batal
              </button>
              <button onClick={saveCareer} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                {editingCareerId ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </Modal>

          <ConfirmDialog
            open={!!deleteCareerTarget}
            title="Hapus Karir"
            message={`Apakah Anda yakin ingin menghapus data karir ${deleteCareerTarget?.jabatan} di ${deleteCareerTarget?.perusahaan}?`}
            onConfirm={deleteCareer}
            onCancel={() => setDeleteCareerTarget(null)}
          />
        </div>
      )}

      {activeTab === 'usaha' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Usaha Saya</h2>
            <button
              onClick={() => openBusinessModal()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Daftarkan Usaha
            </button>
          </div>

          {businessesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-gray-500 text-sm mb-1">Belum ada usaha terdaftar.</p>
              <p className="text-gray-400 text-xs">Daftarkan usahamu agar bisa ditemukan alumni lain.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {businesses.map((biz: any) => (
                <div key={biz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {biz.kategori}
                      </span>
                      {biz.isCariMitra && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Cari Mitra
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        biz.status === 'active' ? 'bg-green-100 text-green-800' :
                        biz.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {biz.status === 'active' ? 'Aktif' : biz.status === 'pending' ? 'Pending' : 'Ditolak'}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{biz.namaUsaha}</h3>
                    {biz.deskripsi && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{biz.deskripsi}</p>}
                    <p className="text-xs text-gray-400 mt-1">{biz.viewsCount ?? 0} dilihat</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openBusinessModal(biz)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => setDeleteBusinessTarget(biz)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal open={businessModal} onClose={() => setBusinessModal(false)}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingBusinessId ? 'Edit Usaha' : 'Daftarkan Usaha'}
            </h3>
            <div className="space-y-4">
              <InputField label="Nama Usaha" value={businessForm.namaUsaha} onChange={v => setBusinessForm(p => ({ ...p, namaUsaha: v }))} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                <select
                  value={businessForm.kategori}
                  onChange={e => setBusinessForm(p => ({ ...p, kategori: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  {BUSINESS_KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={businessForm.deskripsi}
                  onChange={e => setBusinessForm(p => ({ ...p, deskripsi: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsikan usaha Anda..."
                />
              </div>
              <InputField label="No. Kontak" value={businessForm.kontak} onChange={v => setBusinessForm(p => ({ ...p, kontak: v }))} placeholder="08xxxxxxxxxx" />
              <InputField label="Website" type="url" value={businessForm.website} onChange={v => setBusinessForm(p => ({ ...p, website: v }))} placeholder="https://..." />
              <InputField label="Instagram" value={businessForm.instagram} onChange={v => setBusinessForm(p => ({ ...p, instagram: v }))} placeholder="@username" />
              <InputField label="Alamat" value={businessForm.alamat} onChange={v => setBusinessForm(p => ({ ...p, alamat: v }))} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={businessForm.cariMitra}
                  onChange={e => setBusinessForm(p => ({ ...p, cariMitra: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Saya cari mitra kerja sama</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setBusinessModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Batal
              </button>
              <button onClick={saveBusiness} disabled={businessSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {businessSaving ? 'Menyimpan...' : editingBusinessId ? 'Simpan' : 'Daftarkan'}
              </button>
            </div>
          </Modal>

          <ConfirmDialog
            open={!!deleteBusinessTarget}
            title="Hapus Usaha"
            message={`Apakah Anda yakin ingin menghapus usaha "${deleteBusinessTarget?.namaUsaha}"?`}
            onConfirm={deleteBusiness}
            onCancel={() => setDeleteBusinessTarget(null)}
          />

          {activeTab === 'usaha' && businesses.length === 0 && !businessesLoading && <p className="text-sm text-gray-400 py-8 text-center">Memuat data usaha...</p>}
        </div>
      )}
    </div>
  )
}
