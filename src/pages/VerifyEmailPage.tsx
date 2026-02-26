import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { Navbar } from '../components/Navbar'
import { useAuth } from '../lib/auth-context'
import { getReadableAuthError } from '../lib/authError'
import './VerifyEmailPage.css'

type VerifyState = 'idle' | 'loading' | 'success' | 'error'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const queryToken = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams])
  const [token, setToken] = useState(queryToken)
  const [state, setState] = useState<VerifyState>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const { verifyEmail } = useAuth()

  const handleVerify = async () => {
    const trimmedToken = token.trim()
    if (!trimmedToken) {
      setState('error')
      setMessage('Verification token is required.')
      return
    }

    setState('loading')
    setMessage(null)

    try {
      await verifyEmail(trimmedToken)
      setState('success')
      setMessage('Email verified successfully. You can now log in.')
    } catch (error) {
      setState('error')
      setMessage(getReadableAuthError(error, 'Verification failed.'))
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      <Navbar page="home" />
      <div className="verify-page-bg relative flex min-h-[calc(100vh-62px)] items-center justify-center overflow-hidden px-4 py-10">
        <div className="verify-grid-bg pointer-events-none absolute inset-0" />
        <div className="verify-glow pointer-events-none absolute" />

        <div className="verify-card relative w-full max-w-[560px] rounded-3xl border border-white/[0.08] bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8">
          <h1 className="font-display text-center text-3xl font-black tracking-tight text-white">
            Verify your email
          </h1>
          <p className="mt-2 text-center text-sm text-slate-400">
            Paste your verification token if the email link did not open this page automatically.
          </p>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-300">Verification Token</span>
            <input
              className="verify-input w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Paste token from email"
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </label>

          <button
            className="verify-grad-bg mt-5 flex h-12 w-full items-center justify-center rounded-xl font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={state === 'loading'}
            type="button"
            onClick={handleVerify}
          >
            {state === 'loading' ? 'Verifying...' : 'Verify Email'}
          </button>

          {message ? (
            <div
              className={`mt-4 rounded-xl border p-3 text-sm ${
                state === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : state === 'error'
                    ? 'border-red-500/30 bg-red-500/10 text-red-300'
                    : 'border-slate-500/30 bg-slate-500/10 text-slate-300'
              }`}
            >
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-500"
              to="/login"
            >
              Go to Login
            </Link>
            <Link
              className="inline-flex rounded-lg border border-white/10 px-4 py-2 font-semibold text-slate-200 transition-colors hover:bg-white/5"
              to="/create-account"
            >
              Back to Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
