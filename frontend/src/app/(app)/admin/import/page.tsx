'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'

interface UploadResult {
  inserted: number
  errors: (string | { row: number; message: string })[]
  totalRows?: number
  total?: number
}

interface ImportStatus {
  totalRecords: number
  matched: number
  unmatched: number
}

export default function AdminImportPage() {
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [status, setStatus] = useState<ImportStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [dragOver, setDragOver] = useState(false)

  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetName, setSheetName] = useState('')
  const [sheetImporting, setSheetImporting] = useState(false)
  const [sheetResult, setSheetResult] = useState<UploadResult | null>(null)
  const [legacyImporting, setLegacyImporting] = useState(false)
  const [legacyResult, setLegacyResult] = useState<UploadResult | null>(null)

  useEffect(() => {
    fetchApi('/import/buku-induk/status')
      .then((data) => setStatus(data))
      .catch(() => {})
      .finally(() => setStatusLoading(false))
  }, [])

  const refreshStatus = () => {
    fetchApi('/import/buku-induk/status')
      .then((data) => setStatus(data))
      .catch(() => {})
  }

  async function handleUpload(file: File) {
    setUploadResult(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await fetchApi('/import/buku-induk/upload', {
        method: 'POST',
        body: formData,
      })
      setUploadResult(result)
      refreshStatus()
    } catch (err: any) {
      setUploadResult({ inserted: 0, errors: [err.message] })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  async function handleSheetImport() {
    if (!sheetUrl.trim()) return
    setSheetResult(null)
    setSheetImporting(true)
    try {
      const body: any = { sheetUrl: sheetUrl.trim() }
      if (sheetName.trim()) {
        body.sheetRange = `${sheetName.trim()}!A:Z`
      }
      const result = await fetchApi('/import/buku-induk/from-sheet', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      setSheetResult(result)
      refreshStatus()
    } catch (err: any) {
      setSheetResult({ inserted: 0, errors: [err.message] })
    } finally {
      setSheetImporting(false)
    }
  }

  async function handleLegacyImport() {
    setLegacyResult(null)
    setLegacyImporting(true)
    try {
      const result = await fetchApi('/import/from-legacy', {
        method: 'POST',
      })
      setLegacyResult(result)
      refreshStatus()
    } catch (err: any) {
      setLegacyResult({ inserted: 0, errors: [err.message] })
    } finally {
      setLegacyImporting(false)
    }
  }

  const ResultCard = ({ result }: { result: UploadResult }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3">{t('admin.uploadResult')}</h3>
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">{t('admin.inserted')}: {result.inserted}</span>
        </div>
        {'totalRows' in result && result.totalRows && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">Total baris: {result.totalRows}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">{t('admin.errors')}: {result.errors?.length || 0}</span>
        </div>
      </div>
      {result.errors && result.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
          {result.errors.map((err, i) => (
            <p key={i} className="text-xs text-red-600 mb-1">{typeof err === 'string' ? err : err.message || JSON.stringify(err)}</p>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Migrasi dari Platform Lama */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Migrasi Data Platform Lama</h2>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
          <p className="text-sm text-gray-500">
            Import data alumni dari platform lama (koncolawas2005.web.app). Akan mengambil 67 profile alumni
            yang sudah memiliki email dan otomatis membuatkan akun + profile alumni.
          </p>
          <button
            onClick={handleLegacyImport}
            disabled={legacyImporting}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {legacyImporting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
            {legacyImporting ? 'Mengimpor...' : 'Migrate from Old Platform'}
          </button>
          {legacyResult && !legacyImporting && <ResultCard result={legacyResult} />}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-sm text-gray-400 font-medium">Atau</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Import from Google Sheets */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Import dari Google Sheets</h2>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
          <p className="text-sm text-gray-500">
            Paste URL Google Sheets (pastikan sheet sudah di-share ke publik / Anyone with the link can view).
            Kolom yang dikenali: NO. INDUK, NAMA, TAHUN MASUK, KELAS TERAKHIR, NO HP, ALAMAT, KETERANGAN.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSheetImport}
              disabled={sheetImporting || !sheetUrl.trim()}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sheetImporting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
              {sheetImporting ? 'Mengimpor...' : 'Fetch & Import'}
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nama Sheet (opsional — kosongkan untuk sheet pertama)</label>
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="contoh: DATA ALUMNI atau Sheet1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {sheetResult && !sheetImporting && <ResultCard result={sheetResult} />}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-sm text-gray-400 font-medium">ATAU</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Import from CSV */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.importData')} (CSV)</h2>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">{t('admin.dragDrop')}</p>
          <p className="text-xs text-gray-400 mt-1">Kolom: NO. INDUK, NAMA, TAHUN MASUK, KELAS TERAKHIR (export dari Google Sheets)</p>
        </div>

        {uploading && (
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            {t('admin.uploading')}
          </div>
        )}

        {uploadResult && !uploading && <div className="mt-4"><ResultCard result={uploadResult} /></div>}
      </div>

      {/* Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('admin.importStatus')}</h3>
        {statusLoading ? (
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
        ) : status ? (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('admin.totalRecords'), value: status.totalRecords, color: 'text-blue-600 bg-blue-100' },
              { label: t('admin.matched'), value: status.matched, color: 'text-green-600 bg-green-100' },
              { label: t('admin.unmatched'), value: status.unmatched, color: 'text-amber-600 bg-amber-100' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${item.color}`}>
                  <span className="text-lg font-bold">{item.value}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No import data yet</p>
        )}
      </div>
    </div>
  )
}
