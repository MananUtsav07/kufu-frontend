import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { ApiError, verifyAccount } from '../lib/api'

type VerifyStatus = 'loading' | 'success' | 'error'

export function VerifyPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<VerifyStatus>('loading')
  const [message, setMessage] = useState('Verifying your account...')

  const token = useMemo(() => params.get('token')?.trim() ?? '', [params])
  const email = useMemo(() => params.get('email')?.trim() ?? '', [params])

  useEffect(() => {
    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid verification link. Missing token or email.')
      return
    }

    let isMounted = true

    void (async () => {
      try {
        const response = await verifyAccount({ token, email })

        if (!isMounted) {
          return
        }

        if (response.ok) {
          setStatus('success')
          setMessage(response.message ?? 'Email verified successfully. You can now log in.')
          return
        }

        setStatus('error')
        setMessage(response.error ?? 'Verification failed. Please request a new link.')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setStatus('error')
        if (error instanceof ApiError) {
          setMessage(error.message)
          return
        }

        setMessage('Verification failed. Please try again.')
      }
    })()

    return () => {
      isMounted = false
    }
  }, [email, token])

  const statusClassName =
    status === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      : status === 'error'
        ? 'border-red-500/30 bg-red-500/10 text-red-300'
        : 'border-blue-500/30 bg-blue-500/10 text-blue-300'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light p-4 font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="w-full max-w-[520px] rounded-xl border border-slate-200 bg-slate-50/60 p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/40">
        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Email Verification
        </h1>
        <div className={`mt-6 rounded-lg border p-4 text-sm ${statusClassName}`}>{message}</div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Go to Login
          </Link>
          <Link
            to="/create-account"
            className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
