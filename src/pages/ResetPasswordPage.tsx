import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { BrandBotIcon } from '../components/BrandBotIcon'
import { Navbar } from '../components/Navbar'
import { postResetPassword } from '../lib/api'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login', { replace: true }), 2000)
      return () => clearTimeout(timer)
    }
  }, [success, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)
    setError(null)

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await postResetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. The link may have expired.')
    } finally {
      setSubmitting(false)
    }
  }

  const eyeOpen = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
  const eyeOff = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      <style>{`
        .reset-input {
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
        .reset-input::placeholder { color: #334155; }
        .reset-input:focus {
          background: rgba(255,255,255,0.05);
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .reset-submit-btn {
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
        .reset-submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .reset-submit-btn:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
        }
        .reset-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <Navbar page="home" />

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
              Reset password
            </h1>
            <p className="text-slate-500 text-sm">Choose a new password for your account</p>
          </div>

          <div
            className="rounded-2xl p-7"
            style={{
              background: 'linear-gradient(145deg, rgba(12,18,42,0.98), rgba(8,14,34,0.96))',
              border: '1px solid rgba(99,102,241,0.15)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.07), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div
              className="h-px w-full mb-7 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.45), rgba(139,92,246,0.45), transparent)' }}
            />

            {!token ? (
              <div className="space-y-5">
                <div
                  className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Invalid reset link. Please request a new one.
                </div>
                <Link to="/forgot-password" className="block text-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                  Request a new reset link
                </Link>
              </div>
            ) : success ? (
              <div className="space-y-5">
                <div
                  className="rounded-xl px-4 py-4 text-sm text-emerald-300 flex items-start gap-2.5"
                  style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Password reset successfully. Redirecting to login…
                </div>
                <Link to="/login" className="block text-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                  Go to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="rp-password" className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="rp-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="reset-input"
                      style={{ paddingRight: '46px' }}
                    />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-slate-300 transition-colors duration-200">
                      {showPassword ? eyeOff : eyeOpen}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="rp-confirm" className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="rp-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="reset-input"
                      style={{ paddingRight: '46px' }}
                    />
                    <button type="button" aria-label={showConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-600 hover:text-slate-300 transition-colors duration-200">
                      {showConfirm ? eyeOff : eyeOpen}
                    </button>
                  </div>
                </div>

                {validationError && (
                  <div className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {validationError}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}{' '}
                    <Link to="/forgot-password" className="underline hover:text-red-200 ml-1">
                      Request a new link.
                    </Link>
                  </div>
                )}

                <button type="submit" disabled={submitting} className="reset-submit-btn">
                  {submitting ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Resetting…
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <p className="text-center text-sm text-slate-600 pt-1">
                  <Link to="/login" className="font-semibold text-indigo-400 hover:text-white transition-colors duration-200">
                    Back to login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
