'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'

interface Job {
  id: string
  title: string
  type: string
  link?: string
  status: string
  creator?: { name: string }
  createdAt: string
}

export default function AdminJobsPage() {
  const { t } = useTranslation()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [rejectModal, setRejectModal] = useState<{ job: Job } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const tabs = [
    { key: 'pending' as const, label: t('admin.pending') },
    { key: 'approved' as const, label: t('admin.approved') },
    { key: 'rejected' as const, label: t('admin.rejected') },
  ]

  async function fetchJobs() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchApi(`/admin/jobs?status=${tab}`)
      setJobs(data.jobs || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [tab])

  async function handleApprove(jobId: string) {
    setActionLoading(true)
    try {
      await fetchApi(`/jobs/${jobId}/approve`, { method: 'POST' })
      fetchJobs()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    if (!rejectModal) return
    setActionLoading(true)
    try {
      await fetchApi(`/jobs/${rejectModal.job.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: rejectReason }),
      })
      setRejectModal(null)
      setRejectReason('')
      fetchJobs()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return '-' }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.jobManagement')}</h2>

      <div className="flex gap-1 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === tb.key
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-400 py-12">{t('admin.noJobs')}</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{job.title}</h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                  <span>{job.creator?.name || '-'}</span>
                  <span className="capitalize">{job.type}</span>
                  <span>{formatDate(job.createdAt)}</span>
                </div>
                {job.link && (
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline mt-1 inline-block">
                    {job.link}
                  </a>
                )}
              </div>
              {tab === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(job.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {t('admin.approve')}
                  </button>
                  <button
                    onClick={() => setRejectModal({ job })}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {t('admin.reject')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.confirmReject')}</h3>
            <p className="text-sm text-gray-500 mb-4">{rejectModal.job.title}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('admin.rejectReason')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {t('admin.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
