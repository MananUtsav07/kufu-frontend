import { type FormEvent, useEffect, useMemo, useState } from 'react'

import { ApiError, postDashboardProfile } from '../lib/api'
import { useAuth } from '../lib/auth-context'
import './DashboardProfilePage.css'

export function DashboardProfilePage() {
  const { user, client, refreshMe } = useAuth()

  const initials = useMemo(() => {
    if (!user?.email) {
      return '?'
    }
    return user.email.charAt(0).toUpperCase()
  }, [user?.email])

  const [businessName, setBusinessName] = useState(client?.businessName ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(client?.websiteUrl ?? '')
  const [lastSavedProfile, setLastSavedProfile] = useState({
    businessName: client?.businessName ?? '',
    websiteUrl: client?.websiteUrl ?? '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const nextBusinessName = client?.businessName ?? ''
    const nextWebsiteUrl = client?.websiteUrl ?? ''

    setLastSavedProfile({
      businessName: nextBusinessName,
      websiteUrl: nextWebsiteUrl,
    })

    if (!isEditing) {
      setBusinessName(nextBusinessName)
      setWebsiteUrl(nextWebsiteUrl)
    }
  }, [client?.businessName, client?.websiteUrl, isEditing])

  const handleEdit = () => {
    setError(null)
    setSuccess(null)
    setBusinessName(lastSavedProfile.businessName)
    setWebsiteUrl(lastSavedProfile.websiteUrl)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setBusinessName(lastSavedProfile.businessName)
    setWebsiteUrl(lastSavedProfile.websiteUrl)
    setError(null)
    setSuccess(null)
    setIsEditing(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isEditing) {
      return
    }

    setError(null)
    setSuccess(null)

    if (!businessName.trim()) {
      setError('Business name is required.')
      return
    }

    if (websiteUrl.trim()) {
      try {
        // Keep lightweight validation while preserving current API contract.
        new URL(websiteUrl.trim())
      } catch {
        setError('Website URL must be a valid URL.')
        return
      }
    }

    setSaving(true)
    try {
      const nextBusinessName = businessName.trim()
      const nextWebsiteUrl = websiteUrl.trim()

      await postDashboardProfile({
        business_name: nextBusinessName,
        website_url: nextWebsiteUrl || null,
      })

      setLastSavedProfile({
        businessName: nextBusinessName,
        websiteUrl: nextWebsiteUrl,
      })
      await refreshMe()
      setSuccess('Profile updated successfully.')
      setIsEditing(false)
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.message : 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-profile space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Profile</h1>
        <p className="text-sm text-slate-400">Account and business details for your workspace.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      <section className="profile-card rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="profile-avatar flex h-14 w-14 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/20 text-xl font-black text-indigo-100">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.email || 'No user loaded'}</p>
            <p className="text-sm text-slate-400">Role: {user?.role || 'user'}</p>
          </div>
        </div>
      </section>

      <section className="profile-card rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Business Details</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Business Name
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled={!isEditing || saving}
              readOnly={!isEditing}
              type="text"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Website URL
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled={!isEditing || saving}
              placeholder="https://example.com"
              readOnly={!isEditing}
              type="url"
              value={websiteUrl}
              onChange={(event) => setWebsiteUrl(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled
              type="email"
              value={user?.email || ''}
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {!isEditing ? (
              <button
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                type="button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={saving}
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
