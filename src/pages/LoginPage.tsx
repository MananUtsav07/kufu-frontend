import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Navbar } from '../components/Navbar'
import { BrandBotIcon } from '../components/BrandBotIcon'
import { useAuth } from '../lib/auth-context'
import { getReadableAuthError } from '../lib/authError'
import './LoginPage.css'

type LocationState = {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login(email.trim(), password)
      const redirectTo = (location.state as LocationState | null)?.from ?? '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      setError(getReadableAuthError(submitError, 'Unable to sign in.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      <Navbar page="home" />
      <div className="login-page-bg relative flex min-h-[calc(100vh-62px)] items-center justify-center overflow-hidden px-4 py-10">
        <div className="auth-grid-bg pointer-events-none absolute inset-0" />
        <div className="login-glow-top pointer-events-none absolute" />
        <div className="login-glow-bottom pointer-events-none absolute" />

        <div className="login-card relative w-full max-w-[460px] rounded-3xl border border-white/[0.08] bg-slate-900/75 p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="auth-grad-bg mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
              <BrandBotIcon size={20} />
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-white">Kufu</h2>
            <p className="mt-2 text-base text-slate-400">Log in to your dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</span>
              <input
                className="auth-input h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Password</span>
              <div className="relative">
                <input
                  className="auth-input h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-4 pr-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            <button
              className="auth-grad-bg flex h-12 w-full items-center justify-center rounded-xl font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?
            <Link
              className="ml-1 font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
              to="/create-account"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
