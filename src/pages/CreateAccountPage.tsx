import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'

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
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="flex items-center justify-between bg-background-light p-4 pb-2 dark:bg-background-dark">
        <button
          aria-label="Back"
          className="flex size-12 shrink-0 cursor-pointer items-center justify-start text-slate-900 dark:text-slate-100"
          type="button"
          onClick={() => navigate('/login')}
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-100">
          Create Account
        </h2>
      </div>

      <div className="@container">
        <div className="@[480px]:px-4 @[480px]:py-3">
          <div
            className="relative flex min-h-[218px] flex-col justify-end overflow-hidden bg-primary/10 bg-cover bg-center @[480px]:rounded-xl"
            style={{
              backgroundImage:
                'linear-gradient(0deg, rgba(16, 18, 34, 0.8) 0%, rgba(16, 18, 34, 0.2) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUGb8lenjfUYzkcwgT3-19O87vCBiH6Wi7M34rFVpAn57_fAihnyP3rzVyNUJ2c34W7nWGcS5YU1mRyFqE3HBmrN2-sfoQ0eM9AflmX4iWNRvqyrW7lJnKtjGhAoeDO7yJnlaSX3MBDdSV9ysVPe9sEQHeD5kqPYyDmGcFKV2rgoGKvwylCZz9mEWJL1xvDoKDqeQwKkjEUAFnT0S3gZdTTS-DCW-WNe7l3Nyf4HS_Ga0c6_VVwzAUGqPOTDOwz6MpJA05JaiNL9A")',
            }}
          >
            <div className="flex p-6">
              <p className="text-[28px] font-bold leading-tight tracking-tight text-slate-100">Kufu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[480px] px-4 pb-12">
        <h1 className="pb-2 pt-8 text-center text-[32px] font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
          Join Kufu
        </h1>
        <p className="pb-8 text-center text-base font-normal leading-normal text-slate-600 dark:text-slate-400">
          Empower your business with AI-driven customer inquiry automation.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col">
            <label className="pb-1.5 text-sm font-medium leading-normal text-slate-900 dark:text-slate-200">
              Full Name (Optional)
            </label>
            <div className="relative">
              <input
                className="form-input h-14 w-full rounded-lg border border-slate-200 bg-white p-[15px] text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Enter your full name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full flex-col">
            <label className="pb-1.5 text-sm font-medium leading-normal text-slate-900 dark:text-slate-200">
              Email Address
            </label>
            <div className="relative">
              <input
                className="form-input h-14 w-full rounded-lg border border-slate-200 bg-white p-[15px] text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="flex w-full flex-col">
            <label className="pb-1.5 text-sm font-medium leading-normal text-slate-900 dark:text-slate-200">
              Password
            </label>
            <div className="relative">
              <input
                className="form-input h-14 w-full rounded-lg border border-slate-200 bg-white p-[15px] pr-12 text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                minLength={8}
                placeholder="Create a strong password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-4 cursor-pointer text-slate-400"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col">
            <label className="pb-1.5 text-sm font-medium leading-normal text-slate-900 dark:text-slate-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="form-input h-14 w-full rounded-lg border border-slate-200 bg-white p-[15px] pr-12 text-base font-normal leading-normal text-slate-900 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                minLength={8}
                placeholder="Confirm your password"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-4 top-4 cursor-pointer text-slate-400"
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
              >
                <span className="material-symbols-outlined">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

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

        <div className="pb-4 pt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?
            <Link className="ml-1 font-semibold text-primary hover:underline" to="/login">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[12px] leading-relaxed text-slate-500 dark:text-slate-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="h-8 bg-background-light dark:bg-background-dark" />
    </div>
  )
}
