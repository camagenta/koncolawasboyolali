'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import { fetchApi } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

interface AdminUnit {
  id: string
  userId: string
  unitName: string
  tahunMasukTarget: number | null
  user?: { name: string; email: string }
}

const ROLES = ['super_admin', 'admin_unit', 'alumni']

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [adminUnits, setAdminUnits] = useState<AdminUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)
  const [roleFilter, setRoleFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [search, setSearch] = useState('')

  const [newUnitUserId, setNewUnitUserId] = useState('')
  const [newUnitName, setNewUnitName] = useState('')
  const [newUnitTahun, setNewUnitTahun] = useState('')

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (roleFilter) params.set('role', roleFilter)
      if (activeFilter) params.set('isActive', activeFilter)
      if (search) params.set('q', search)
      const data = await fetchApi(`/admin/users?${params}`)
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err.message)
    }
  }, [page, limit, roleFilter, activeFilter, search])

  const fetchAdminUnits = useCallback(async () => {
    try {
      const data = await fetchApi('/admin/admin-units')
      setAdminUnits(data.adminUnits || [])
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchUsers(), fetchAdminUnits()]).finally(() => setLoading(false))
  }, [fetchUsers, fetchAdminUnits])

  const changeRole = async (userId: string, role: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) })
      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const toggleActive = async (user: User) => {
    try {
      const endpoint = user.isActive ? 'deactivate' : 'activate'
      await fetchApi(`/admin/users/${user.id}/${endpoint}`, { method: 'PATCH' })
      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const addAdminUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUnitUserId || !newUnitName) return
    try {
      await fetchApi('/admin/admin-units', {
        method: 'POST',
        body: JSON.stringify({
          userId: newUnitUserId,
          unitName: newUnitName,
          tahunMasukTarget: newUnitTahun ? Number(newUnitTahun) : undefined,
        }),
      })
      setNewUnitUserId('')
      setNewUnitName('')
      setNewUnitTahun('')
      fetchAdminUnits()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const totalPages = Math.ceil(total / limit)
  const formatDate = (d: string | null) => {
    if (!d) return '-'
    try {
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return '-' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.userManagement')}</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{error}</div>
        )}

        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <input
            type="text"
            placeholder={t('admin.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 min-w-[200px]"
          />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('admin.allRoles')}</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setPage(1) }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('admin.allStatus')}</option>
            <option value="true">{t('admin.active')}</option>
            <option value="false">{t('admin.inactive')}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">{t('admin.name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.email')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.role')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.status')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.lastLogin')}</th>
                <th className="pb-3 font-medium">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">{t('admin.noUsers')}</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{u.name}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{u.email}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {u.isActive ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(u.lastLoginAt)}</td>
                  <td className="py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        u.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {u.isActive ? t('admin.deactivate') : t('admin.activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>{t('admin.page')} {page} {t('admin.of')} {totalPages} ({t('admin.total')} {total} {t('admin.usersCount')})</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.adminUnits')}</h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">{t('admin.name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('admin.unitName')}</th>
                <th className="pb-3 font-medium">{t('admin.targetYear')}</th>
              </tr>
            </thead>
            <tbody>
              {adminUnits.length === 0 ? (
                <tr><td colSpan={3} className="py-8 text-center text-gray-400">{t('admin.noAdminUnits')}</td></tr>
              ) : adminUnits.map((au) => (
                <tr key={au.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 text-gray-900 whitespace-nowrap">{au.user?.name || au.userId}</td>
                  <td className="py-3 pr-4 text-gray-500">{au.unitName}</td>
                  <td className="py-3 text-gray-500">{au.tahunMasukTarget || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={addAdminUnit} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('admin.addAdminUnit')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <select
              value={newUnitUserId}
              onChange={(e) => setNewUnitUserId(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('admin.selectUser')}</option>
              {users.filter((u) => u.role === 'alumni').map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <input
              type="text"
              placeholder={t('admin.unitName')}
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder={t('admin.targetYear')}
              value={newUnitTahun}
              onChange={(e) => setNewUnitTahun(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {t('admin.addAdminUnit')}
          </button>
        </form>
      </div>
    </div>
  )
}
