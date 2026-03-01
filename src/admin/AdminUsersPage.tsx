import { useEffect, useState } from 'react'

import {
  ApiError,
  getAdminUsers,
  postAdminUserPlan,
  type AdminUserListItem,
} from '../lib/api'
import './AdminUsersPage.css'

const PLAN_OPTIONS = ['free', 'starter', 'pro', 'business'] as const

export function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [draftPlans, setDraftPlans] = useState<Record<string, string>>({})
  const [savingByUserId, setSavingByUserId] = useState<Record<string, boolean>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminUsers()
      setUsers(response.users)
      setDraftPlans(
        Object.fromEntries(response.users.map((user) => [user.id, user.currentPlanCode])),
      )
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const handleSavePlan = async (userId: string) => {
    const targetPlan = draftPlans[userId]
    if (!targetPlan || !PLAN_OPTIONS.includes(targetPlan as (typeof PLAN_OPTIONS)[number])) {
      setError('Invalid plan selection.')
      return
    }

    setError(null)
    setSuccessMessage(null)
    setSavingByUserId((current) => ({ ...current, [userId]: true }))
    try {
      await postAdminUserPlan(userId, { planCode: targetPlan as (typeof PLAN_OPTIONS)[number] })
      setUsers((current) =>
        current.map((item) => (item.id === userId ? { ...item, currentPlanCode: targetPlan } : item)),
      )
      setSuccessMessage('Plan updated successfully.')
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.message : 'Failed to update user plan.')
    } finally {
      setSavingByUserId((current) => ({ ...current, [userId]: false }))
    }
  }

  return (
    <div className="admin-users-page space-y-5">
      <div>
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">Users & Plans</h2>
        <p className="text-sm text-slate-400">Manage user plans directly from admin dashboard.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-users-table min-w-full border-collapse">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Verified</th>
                  <th className="px-2 py-2">Usage</th>
                  <th className="px-2 py-2">Plan</th>
                  <th className="px-2 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10 text-sm text-slate-200">
                    <td className="px-2 py-3">
                      <p className="font-medium text-slate-100">{user.email}</p>
                      <p className="text-[11px] text-slate-500">{user.id}</p>
                    </td>
                    <td className="px-2 py-3 capitalize">{user.role}</td>
                    <td className="px-2 py-3">{user.is_verified ? 'Yes' : 'No'}</td>
                    <td className="px-2 py-3">{user.messageUsageThisPeriod}</td>
                    <td className="px-2 py-3">
                      <select
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-200"
                        value={draftPlans[user.id] ?? user.currentPlanCode}
                        onChange={(event) =>
                          setDraftPlans((current) => ({ ...current, [user.id]: event.target.value }))
                        }
                      >
                        {PLAN_OPTIONS.map((planCode) => (
                          <option key={planCode} value={planCode}>
                            {planCode}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={Boolean(savingByUserId[user.id])}
                        type="button"
                        onClick={() => {
                          void handleSavePlan(user.id)
                        }}
                      >
                        {savingByUserId[user.id] ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

