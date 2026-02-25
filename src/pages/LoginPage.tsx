import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { getReadableAuthError } from '../lib/authError'
import { supabase } from '../lib/supabaseClient'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      await signIn(email.trim(), password)
      navigate('/', { replace: true })
    } catch (error) {
      setErrorMessage(getReadableAuthError(error, 'Unable to sign in.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage('Enter your email first, then click Forgot password.')
      return
    }

    setIsSendingReset(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      })

      if (error) {
        throw error
      }

      setSuccessMessage('Password reset email sent. Check your inbox.')
    } catch (error) {
      setErrorMessage(getReadableAuthError(error, 'Unable to send reset email.'))
    } finally {
      setIsSendingReset(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light p-4 font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="w-full max-w-[480px] space-y-8 rounded-xl border border-slate-200 bg-slate-50/50 p-8 shadow-2xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-[0_0_20px_rgba(19,37,236,0.3)]">
            <span className="material-symbols-outlined text-3xl text-white">auto_awesome</span>
          </div>
          <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            Kufu
          </h2>
          <p className="mt-2 text-center text-base font-normal text-slate-600 dark:text-slate-400">
            Log in to your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </span>
              <input
                className="form-input h-12 w-full rounded-lg border-slate-300 bg-white px-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </span>
                <button
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  disabled={isSendingReset}
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  className="form-input h-12 w-full rounded-lg border-slate-300 bg-white pl-4 pr-12 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="********"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>
          </div>

          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
            <span className="material-symbols-outlined text-[18px]">login</span>
          </button>

          {errorMessage ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              {successMessage}
            </div>
          ) : null}
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background-light px-3 font-medium text-slate-500 dark:bg-[#15172a]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            disabled
            type="button"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-medium">Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?
          <Link className="ml-1 font-semibold text-primary transition-colors hover:text-primary/80" to="/create-account">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 flex gap-6 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
        <a className="transition-colors hover:text-primary" href="#">
          Privacy Policy
        </a>
        <a className="transition-colors hover:text-primary" href="#">
          Terms of Service
        </a>
        <a className="transition-colors hover:text-primary" href="#">
          Support
        </a>
      </div>
    </div>
  )
}
