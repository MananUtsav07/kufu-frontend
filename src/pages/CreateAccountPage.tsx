import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { BrandBotIcon } from '../components/BrandBotIcon'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../lib/auth-context'
import { getReadableAuthError } from '../lib/authError'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
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
  )
}

function InputField({
  id, label, type = 'text', placeholder, required = false, value, onChange, optional = false,
}: {
  id: string; label: string; type?: string; placeholder: string
  required?: boolean; value: string; onChange: (v: string) => void; optional?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
        {label}
        {optional && <span className="text-[0.65rem] normal-case tracking-normal text-slate-600 font-medium">optional</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} required={required}
        value={value} onChange={(e) => onChange(e.target.value)}
        className="auth-field"
      />
    </div>
  )
}

function PasswordField({
  id, label, placeholder, value, onChange, show, onToggle,
}: {
  id: string; label: string; placeholder: string
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">{label}</label>
      <div className="relative">
        <input
          id={id} type={show ? 'text' : 'password'} placeholder={placeholder}
          required minLength={8} value={value} onChange={(e) => onChange(e.target.value)}
          className="auth-field" style={{ paddingRight: '46px' }}
        />
        <button
          type="button" aria-label={show ? 'Hide' : 'Show'}
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-slate-300 transition-colors duration-200"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}

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
  const [devToken, setDevToken] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setDevToken(null)

    const normalizedEmail = email.trim().toLowerCase()
    if (!emailPattern.test(normalizedEmail)) { setError('Enter a valid email address.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (confirmPassword !== password) { setError('Passwords do not match.'); return }

    setSubmitting(true)
    try {
      const response = await register({
        email: normalizedEmail, password,
        businessName: businessName.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      })
      setSuccess('Account created! Check your email to verify your account.')
      if (response.devToken) setDevToken(response.devToken)
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
      <style>{`
        .auth-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f1f5f9;
          font-size: 14px;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .auth-field::placeholder { color: #334155; }
        .auth-field:focus {
          background: rgba(255,255,255,0.05);
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .submit-btn {
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
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
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
        <div className="w-full max-w-[460px]">

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
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">Start using Kufu on your website today</p>
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

            {success ? (
              /* Success state */
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Account created!</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{success}</p>
                </div>
                {devToken && (
                  <div
                    className="w-full rounded-xl p-3 text-left"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
                  >
                    <p className="text-[0.68rem] font-bold uppercase tracking-widest text-emerald-500 mb-1 font-mono">Dev Token</p>
                    <p className="text-xs text-emerald-300 font-mono break-all">{devToken}</p>
                  </div>
                )}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-white transition-colors duration-200"
                >
                  Go to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Business info row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    id="businessName" label="Business Name"
                    placeholder="Acme Inc." value={businessName}
                    onChange={setBusinessName} optional
                  />
                  <InputField
                    id="websiteUrl" label="Website URL" type="url"
                    placeholder="https://yoursite.com" value={websiteUrl}
                    onChange={setWebsiteUrl} optional
                  />
                </div>

                <InputField
                  id="email" label="Email Address" type="email"
                  placeholder="name@company.com" required
                  value={email} onChange={setEmail}
                />

                <PasswordField
                  id="password" label="Password"
                  placeholder="Minimum 8 characters"
                  value={password} onChange={setPassword}
                  show={showPassword} onToggle={() => setShowPassword((v) => !v)}
                />

                <PasswordField
                  id="confirmPassword" label="Confirm Password"
                  placeholder="Repeat your password"
                  value={confirmPassword} onChange={setConfirmPassword}
                  show={showConfirmPassword} onToggle={() => setShowConfirmPassword((v) => !v)}
                />

                {/* Error */}
                {error && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2.5"
                    style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="submit-btn" style={{ marginTop: '8px' }}>
                  {submitting ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Creating account…
                    </>
                  ) : 'Create Account'}
                </button>
              </form>
            )}
          </div>

          {/* Login link */}
          {!success && (
            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-white transition-colors duration-200">
                Sign in
              </Link>
            </p>
          )}

          {/* Terms */}
          <p className="text-center text-[0.7rem] leading-relaxed text-slate-600 mt-4">
            By creating an account you agree to our{' '}
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}