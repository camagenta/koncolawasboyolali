'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'

interface PublicProfile {
  id: string
  namaLengkap: string
  fotoProfil?: string
  tahunMasuk: number
  tahunLulus: number
  jurusan?: string
  kelas3: string
  kotaDomisili: string
  statusUtama: string
  user: { id: string; name: string; avatarUrl?: string }
  educations: Education[]
  careers: Career[]
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

function getStatusColor(status: string) {
  switch (status) {
    case 'Bekerja': return 'bg-green-100 text-green-700'
    case 'Kuliah': return 'bg-blue-100 text-blue-700'
    case 'Wirausaha': return 'bg-purple-100 text-purple-700'
    case 'Belum_Bekerja': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const statusLabel = (s: string) => s === 'Belum_Bekerja' ? 'Belum Bekerja' : s

export default function AlumniDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    fetchApi<PublicProfile>(`/alumni/profiles/${id}/public`)
      .then((data) => {
        setProfile(data)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat profil')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          &larr; Kembali
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p className="text-gray-500 text-sm mb-4">Profil alumni tidak ditemukan</p>
        <Link href="/alumni" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          &larr; Kembali ke direktori
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/alumni"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Kembali ke direktori
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
            {profile.fotoProfil ? (
              <img src={profile.fotoProfil} alt={profile.namaLengkap} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl font-bold text-gray-900">{profile.namaLengkap}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Angkatan {profile.tahunMasuk}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(profile.statusUtama)}`}>
                {statusLabel(profile.statusUtama)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Tahun Masuk</p>
            <p className="text-sm font-medium text-gray-900">{profile.tahunMasuk}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Tahun Lulus</p>
            <p className="text-sm font-medium text-gray-900">{profile.tahunLulus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Jurusan</p>
            <p className="text-sm font-medium text-gray-900">{profile.jurusan || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Kelas 3</p>
            <p className="text-sm font-medium text-gray-900">{profile.kelas3}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Kota Domisili</p>
            <p className="text-sm font-medium text-gray-900">{profile.kotaDomisili}</p>
          </div>
        </div>
      </div>

      {profile.educations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Pendidikan</h2>
          <div className="space-y-3">
            {profile.educations.map((edu) => (
              <div key={edu.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{edu.institusi}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {edu.jenjang}
                    </span>
                  </div>
                  {edu.jurusan && <p className="text-sm text-gray-600">{edu.jurusan}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {edu.tahunMasuk && `${edu.tahunMasuk}`}{edu.tahunMasuk && edu.tahunLulus ? ' - ' : ''}{edu.tahunLulus && `${edu.tahunLulus}`}
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                      edu.status === 'Lulus' ? 'bg-green-100 text-green-800' :
                      edu.status === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {edu.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.careers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Karir</h2>
          <div className="space-y-4">
            {profile.careers.map((car, idx) => (
              <div key={car.id} className="relative pl-6 pb-4 last:pb-0">
                {idx < profile.careers.length - 1 && (
                  <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-white" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{car.jabatan}</span>
                    <span className="text-sm text-gray-500">di</span>
                    <span className="text-sm font-semibold text-blue-600">{car.perusahaan}</span>
                  </div>
                  {car.sektorIndustri && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 mt-1">
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
