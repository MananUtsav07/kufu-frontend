import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { BrandBotIcon } from '../components/BrandBotIcon'
import { Navbar } from '../components/Navbar'
import { getReadableAuthError } from '../lib/authError'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

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
      await login(email.trim(), password)
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
    setSuccessMessage('Password reset flow is not enabled yet. Please contact support.')
    setIsSendingReset(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      <Navbar page="home" />
      <div className="relative flex min-h-[calc(100vh-62px)] items-center justify-center overflow-hidden px-4 py-10">
      <style>{`
  .grad-bg { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 9999px rgba(255, 255, 255, 0.03) inset !important;
    -webkit-text-fill-color: #f1f5f9 !important;
    caret-color: #f1f5f9;
    transition: background-color 9999s ease-in-out 0s;
  }
`}</style>

      <div className="pointer-events-none absolute -top-28 right-[-110px] h-[380px] w-[380px] rounded-full bg-indigo-600/20 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 left-[-120px] h-[340px] w-[340px] rounded-full bg-violet-600/15 blur-[85px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative w-full max-w-[460px] rounded-3xl border border-white/[0.08] bg-slate-900/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl grad-bg shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            <BrandBotIcon size={20} />
          </div>
          <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white">
            Kufu
          </h2>
          <p className="mt-2 text-base text-slate-400">
            Log in to your account
          </p>
        </div>

        <form autoComplete="off" className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">
                Email Address
              </span>
              <input
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-base text-slate-100 transition-all placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  Password
                </span>
                <button
                  className="text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                  disabled={isSendingReset}
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-4 pr-12 text-base text-slate-100 transition-all placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="********"
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
          </div>

          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl grad-bg font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
            <span className="material-symbols-outlined text-[18px]">login</span>
          </button>

          {errorMessage ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {successMessage}
            </div>
          ) : null}
        </form>

        <div className="relative mb-4 mt-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.1]" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full border border-white/[0.08] bg-slate-900/95 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-slate-300 transition-colors hover:bg-white/[0.06] disabled:opacity-80"
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

        <p className="mt-5 text-center text-sm text-slate-400">
          Don&apos;t have an account?
          <Link className="ml-1 font-semibold text-indigo-300 transition-colors hover:text-indigo-200" to="/create-account">
            Create an account
          </Link>
        </p>
      </div>

      <div className="absolute bottom-5 hidden gap-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:flex">
        <a className="transition-colors hover:text-indigo-300" href="#">
          Privacy Policy
        </a>
        <a className="transition-colors hover:text-indigo-300" href="#">
          Terms of Service
        </a>
        <a className="transition-colors hover:text-indigo-300" href="#">
          Support
        </a>
      </div>
      </div>
    </div>
  )
}
