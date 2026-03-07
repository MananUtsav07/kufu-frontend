import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ApiError } from '../lib/api'
import { useTenantAuth } from './tenant-auth-context'

export function PropertyTenantLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useTenantAuth()

  const [tenantAccessId, setTenantAccessId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({
        tenantAccessId: tenantAccessId.trim(),
        password,
        email: email.trim() || undefined,
      })

      const nextPath = typeof location.state?.from === 'string' ? location.state.from : '/property-management/tenant'
      navigate(nextPath, { replace: true })
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Tenant login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h1 className="font-display text-2xl font-black text-white">Tenant Login</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in with your tenant access ID and password.</p>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
        ) : null}

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Tenant Access ID</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              placeholder="TEN-AB12CD34"
              required
              value={tenantAccessId}
              onChange={(event) => setTenantAccessId(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Email (optional)</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              placeholder="tenant@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Password</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            className="w-full rounded-lg border border-indigo-500/35 bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
