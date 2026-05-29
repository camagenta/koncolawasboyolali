'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'

const MapClient = dynamic(() => import('./map-client'), { ssr: false })

interface AlumniCity {
  kota: string
  count: number
}

interface AlumniKecamatan {
  kecamatan: string
  count: number
}

interface AlumniStatus {
  status: string
  count: number
}

const TABS = [
  { key: 'city', label: 'Peta Kota' },
  { key: 'kecamatan', label: 'Peta Kecamatan Boyolali' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function MapPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('city')

  const [cityData, setCityData] = useState<AlumniCity[]>([])
  const [kecamatanData, setKecamatanData] = useState<AlumniKecamatan[]>([])
  const [statusData, setStatusData] = useState<AlumniStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [popupInfo, setPopupInfo] = useState<{ name: string; count: number } | null>(null)

  useEffect(() => {
    async function fetchMapData() {
      setLoading(true)
      setError('')
      try {
        const [city, kecamatan, status] = await Promise.all([
          fetchApi<AlumniCity[]>('/maps/alumni-by-city'),
          fetchApi<AlumniKecamatan[]>('/maps/alumni-by-kecamatan'),
          fetchApi<AlumniStatus[]>('/maps/alumni-by-status'),
        ])
        if (Array.isArray(city)) setCityData(city)
        if (Array.isArray(kecamatan)) setKecamatanData(kecamatan)
        if (Array.isArray(status)) setStatusData(status)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data peta')
      } finally {
        setLoading(false)
      }
    }
    fetchMapData()
  }, [])

  const currentData: AlumniCity[] | AlumniKecamatan[] = activeTab === 'city'
    ? cityData.filter(d => d.kota.trim() !== '')
    : kecamatanData.filter(d => d.kecamatan.trim() !== '')
  const totalAlumni = currentData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.map')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Sebaran alumni SMAN 1 Boyolali
        </p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="h-[500px]">
                <MapClient
                  data={currentData}
                  mode={activeTab}
                  onMarkerClick={(name, count) => setPopupInfo({ name, count })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Ringkasan</h3>
            <p className="text-2xl font-bold text-blue-600">{totalAlumni}</p>
            <p className="text-xs text-gray-500">
              Total alumni{' '}
              {activeTab === 'city' ? 'terdata' : 'di Boyolali'}
            </p>
          </div>

          {popupInfo && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Detail Lokasi
              </h3>
              <p className="font-medium text-gray-900">{popupInfo.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {popupInfo.count} alumni
              </p>
              <button
                onClick={() => setPopupInfo(null)}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600"
              >
                Tutup
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Status Alumni
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Status pekerjaan utama alumni
            </p>
            <div className="space-y-2">
              {statusData.length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada data</p>
              ) : (
                statusData.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate">{s.status}</span>
                    <span className="font-medium text-gray-900 ml-2">
                      {s.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
