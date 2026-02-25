import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { BrandBotIcon } from '../components/BrandBotIcon'
import { Navbar } from '../components/Navbar'
import { getReadableAuthError } from '../lib/authError'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CreateAccountPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setErrorMessage('Email is required.')
      return
    }

    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage('Enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
      return
    }

    if (confirmPassword !== password) {
      setErrorMessage('Confirm password must match password.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signUp(trimmedEmail, password, name.trim() || undefined)

      if (result.requiresEmailConfirmation) {
        setSuccessMessage('Check your email to confirm your account.')
        setPassword('')
        setConfirmPassword('')
        return
      }

      navigate('/', { replace: true })
    } catch (error) {
      setErrorMessage(getReadableAuthError(error, 'Unable to create account.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      <Navbar page="home" />
      <div className="relative flex min-h-[calc(100vh-62px)] items-center justify-center overflow-hidden px-4 py-10">
       <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap');
  .font-display { font-family: 'Syne', sans-serif; }
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

        <div className="relative w-full max-w-[500px] rounded-3xl border border-white/[0.08] bg-slate-900/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl grad-bg shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
              <BrandBotIcon size={20} />
            </div>
            <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white">Create account</h2>
            <p className="mt-2 text-base text-slate-400">Start automating your customer conversations with Kufu.</p>
          </div>

          <form autoComplete="off" className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name (Optional)</label>
              <input
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Enter your full name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email Address</label>
              <input
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-4 pr-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  minLength={8}
                  placeholder="Create a strong password"
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
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <input
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-4 pr-12 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  minLength={8}
                  placeholder="Confirm your password"
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
            </div>

            <button
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl grad-bg font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
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

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?
            <Link className="ml-1 font-semibold text-indigo-300 transition-colors hover:text-indigo-200" to="/login">
              Sign in
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
