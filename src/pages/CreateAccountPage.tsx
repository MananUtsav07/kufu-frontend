import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { BrandBotIcon } from '../components/BrandBotIcon'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../lib/auth-context'
import { getReadableAuthError } from '../lib/authError'
import './CreateAccountPage.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CreateAccountPage() {
  const { register } = useAuth()

  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const normalizedEmail = email.trim().toLowerCase()
    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (confirmPassword !== password) {
      setError('Confirm password must match password.')
      return
    }

    setSubmitting(true)
    try {
      await register({
        email: normalizedEmail,
        password,
        businessName: businessName.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      })

      setSuccess('Account created. Check your email for verification token or link.')
      setPassword('')
      setConfirmPassword('')
    } catch (submitError) {
      setError(getReadableAuthError(submitError, 'Unable to create account.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      <Navbar page="home" />
      <div className="create-account-page-bg relative flex min-h-[calc(100vh-62px)] items-center justify-center overflow-hidden px-4 py-10">
        <div className="auth-grid-bg pointer-events-none absolute inset-0" />
        <div className="create-account-glow-top pointer-events-none absolute" />
        <div className="create-account-glow-bottom pointer-events-none absolute" />

        <div className="create-account-card relative w-full max-w-[500px] rounded-3xl border border-white/[0.08] bg-slate-900/75 p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="auth-grad-bg mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
              <BrandBotIcon size={20} />
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-white">Create account</h2>
            <p className="mt-2 text-base text-slate-400">
              Start with Kufu dashboard for your business.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Business Name (Optional)</span>
              <input
                className="auth-input h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Acme Clinic"
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Website URL (Optional)</span>
              <input
                className="auth-input h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="https://example.com"
                type="url"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
              />
            </label>

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
                  minLength={8}
                  placeholder="Minimum 8 characters"
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

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Confirm Password</span>
              <div className="relative">
                <input
                  className="auth-input h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-4 pr-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  minLength={8}
                  placeholder="Repeat your password"
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            <button
              className="auth-grad-bg mt-2 flex h-12 w-full items-center justify-center rounded-xl font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                {success}
              </div>
            ) : null}
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?
            <Link
              className="ml-1 font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
              to="/login"
            >
              Login
            </Link>
          </p>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-slate-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
