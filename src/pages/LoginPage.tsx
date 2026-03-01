import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Navbar } from '../components/Navbar'
import { BrandBotIcon } from '../components/BrandBotIcon'
import { useAuth } from '../lib/auth-context'
import { getReadableAuthError } from '../lib/authError'

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
      <style>{`
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          color: #f1f5f9;
          font-size: 14px;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .login-input::placeholder { color: #334155; }
        .login-input:focus {
          background: rgba(255,255,255,0.05);
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .sign-in-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 12px;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 700;
          color: white;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          transition: box-shadow 0.3s ease, opacity 0.2s ease, transform 0.2s ease;
          margin-top: 8px;
        }
        .sign-in-btn:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .sign-in-btn:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
        }
        .sign-in-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <Navbar page="home" />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-900/[0.12] blur-[100px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="pt-[62px] flex min-h-[calc(100vh-62px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">

          {/* Logo + heading */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 24px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.15)',
              }}
            >
              <BrandBotIcon size={24} />
            </div>
            <h1
              className="font-display font-black text-white mb-2"
              style={{ fontSize: '1.9rem', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">Sign in to your Kufu dashboard</p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: 'linear-gradient(145deg, rgba(12,18,42,0.98), rgba(8,14,34,0.96))',
              border: '1px solid rgba(99,102,241,0.15)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.07), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Top accent */}
            <div
              className="h-px w-full mb-7 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.45), rgba(139,92,246,0.45), transparent)' }}
            />

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    style={{ paddingRight: '46px' }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-slate-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5"
                  style={{
                    background: 'rgba(239,68,68,0.07)',
                    border: '1px solid rgba(239,68,68,0.18)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="sign-in-btn"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Sign up link — clean, no arrow */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{' '}
            <Link
              to="/create-account"
              className="font-semibold text-indigo-400 hover:text-white transition-colors duration-200"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}