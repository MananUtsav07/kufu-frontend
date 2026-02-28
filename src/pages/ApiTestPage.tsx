import { useMemo, useState } from 'react'

import {
  getDashboardChatbots,
  getDashboardKnowledge,
  getDashboardLeads,
  getDashboardSummary,
  getHealth,
  getMe,
  patchDashboardLeadStatus,
  postDashboardKnowledge,
  postLogin,
  postLogout,
  postRegister,
  postVerifyEmail,
} from '../lib/api'
import { useAuth } from '../lib/auth-context'
import './ApiTestPage.css'

type TestStatus = 'pass' | 'fail' | 'skipped'

type TestResult = {
  name: string
  status: TestStatus
  payload: unknown
}

function randomTestEmail(): string {
  return `apitest_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`
}

function randomBusinessName(): string {
  return `Kufu Test ${Math.floor(Math.random() * 9999)}`
}

export function ApiTestPage() {
  const { setToken } = useAuth()
  const [manualToken, setManualToken] = useState('')
  const [working, setWorking] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [createdEmail, setCreatedEmail] = useState('')
  const [createdPassword, setCreatedPassword] = useState('KufuTest@12345')
  const [note, setNote] = useState<string | null>(null)

  const summary = useMemo(() => {
    const pass = results.filter((item) => item.status === 'pass').length
    const fail = results.filter((item) => item.status === 'fail').length
    const skipped = results.filter((item) => item.status === 'skipped').length
    return { pass, fail, skipped, total: results.length }
  }, [results])

  const pushResult = (result: TestResult) => {
    setResults((current) => [...current, result])
    console.log('[api-test]', result.name, result.status, result.payload)
  }

  const runAllTests = async () => {
    setWorking(true)
    setResults([])
    setNote(null)

    const email = randomTestEmail()
    const password = 'KufuTest@12345'
    setCreatedEmail(email)
    setCreatedPassword(password)

    let tokenFromLogin = ''
    let resolvedVerifyToken = manualToken.trim()

    try {
      const health = await getHealth()
      pushResult({ name: 'GET /api/health', status: 'pass', payload: health })
    } catch (error) {
      pushResult({ name: 'GET /api/health', status: 'fail', payload: error })
    }

    try {
      const registerResponse = await postRegister({
        email,
        password,
        business_name: randomBusinessName(),
        website_url: 'https://example.com',
      })
      pushResult({ name: 'POST /api/auth/register', status: 'pass', payload: registerResponse })

      if (typeof registerResponse.devToken === 'string' && registerResponse.devToken.trim()) {
        resolvedVerifyToken = registerResponse.devToken.trim()
        setManualToken(resolvedVerifyToken)
      }
    } catch (error) {
      pushResult({ name: 'POST /api/auth/register', status: 'fail', payload: error })
      setWorking(false)
      return
    }

    if (!resolvedVerifyToken) {
      pushResult({
        name: 'POST /api/auth/verify-email',
        status: 'skipped',
        payload: 'Token not returned by backend. Paste token from email/log and run again.',
      })
      setNote('Verification token is required to continue. Paste it in the field and run again.')
      setWorking(false)
      return
    }

    try {
      const verifyResponse = await postVerifyEmail({ token: resolvedVerifyToken })
      pushResult({ name: 'POST /api/auth/verify-email', status: 'pass', payload: verifyResponse })
    } catch (error) {
      pushResult({ name: 'POST /api/auth/verify-email', status: 'fail', payload: error })
      setWorking(false)
      return
    }

    try {
      const loginResponse = await postLogin({ email, password })
      tokenFromLogin = loginResponse.token
      setToken(loginResponse.token)
      pushResult({ name: 'POST /api/auth/login', status: 'pass', payload: loginResponse })
    } catch (error) {
      pushResult({ name: 'POST /api/auth/login', status: 'fail', payload: error })
      setWorking(false)
      return
    }

    if (!tokenFromLogin) {
      setWorking(false)
      return
    }

    try {
      const meResponse = await getMe()
      pushResult({ name: 'GET /api/auth/me', status: 'pass', payload: meResponse })
    } catch (error) {
      pushResult({ name: 'GET /api/auth/me', status: 'fail', payload: error })
    }

    try {
      const summaryResponse = await getDashboardSummary()
      pushResult({ name: 'GET /api/dashboard/summary', status: 'pass', payload: summaryResponse })
    } catch (error) {
      pushResult({ name: 'GET /api/dashboard/summary', status: 'fail', payload: error })
    }

    try {
      const chatbotsResponse = await getDashboardChatbots()
      pushResult({ name: 'GET /api/dashboard/chatbots', status: 'pass', payload: chatbotsResponse })
    } catch (error) {
      pushResult({ name: 'GET /api/dashboard/chatbots', status: 'fail', payload: error })
    }

    try {
      const knowledgeResponse = await getDashboardKnowledge()
      pushResult({ name: 'GET /api/dashboard/knowledge', status: 'pass', payload: knowledgeResponse })
    } catch (error) {
      pushResult({ name: 'GET /api/dashboard/knowledge', status: 'fail', payload: error })
    }

    try {
      const knowledgeUpsertResponse = await postDashboardKnowledge({
        services_text: 'Website chatbot, WhatsApp automation, Instagram DM assistant',
        pricing_text: 'Starter plan test update from API harness',
        faqs_json: [{ question: 'Do you offer setup?', answer: 'Yes, onboarding is included.' }],
        hours_text: 'Mon-Sat, 9 AM to 7 PM IST',
        contact_text: 'WhatsApp +91 98765 43210',
        knowledge_base_text: 'This is a test knowledge update.',
      })
      pushResult({ name: 'POST /api/dashboard/knowledge', status: 'pass', payload: knowledgeUpsertResponse })
    } catch (error) {
      pushResult({ name: 'POST /api/dashboard/knowledge', status: 'fail', payload: error })
    }

    let firstLeadId: string | null = null
    try {
      const leadsResponse = await getDashboardLeads({ limit: 20, offset: 0 })
      firstLeadId = leadsResponse.leads[0]?.id ?? null
      pushResult({ name: 'GET /api/dashboard/leads?limit=20&offset=0', status: 'pass', payload: leadsResponse })
    } catch (error) {
      pushResult({ name: 'GET /api/dashboard/leads', status: 'fail', payload: error })
    }

    if (firstLeadId) {
      try {
        const patchResponse = await patchDashboardLeadStatus(firstLeadId, 'contacted')
        pushResult({ name: `PATCH /api/dashboard/leads/${firstLeadId}`, status: 'pass', payload: patchResponse })
      } catch (error) {
        pushResult({ name: `PATCH /api/dashboard/leads/${firstLeadId}`, status: 'fail', payload: error })
      }
    } else {
      pushResult({ name: 'PATCH /api/dashboard/leads/:id', status: 'skipped', payload: 'No leads available.' })
    }

    try {
      const logoutResponse = await postLogout()
      pushResult({ name: 'POST /api/auth/logout', status: 'pass', payload: logoutResponse })
    } catch (error) {
      pushResult({ name: 'POST /api/auth/logout', status: 'fail', payload: error })
    }

    setWorking(false)
  }

  return (
    <div className="api-test-page min-h-screen bg-[#020617] px-4 py-8 text-slate-200 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="api-test-card rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl sm:p-6">
          <h1 className="font-display text-3xl font-black text-white">API Test Harness</h1>
          <p className="mt-2 text-sm text-slate-400">
            Runs frontend calls against auth + dashboard APIs and shows pass/fail responses.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Manual Verification Token</span>
              <input
                className="api-test-input h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Paste token from email"
                type="text"
                value={manualToken}
                onChange={(event) => setManualToken(event.target.value)}
              />
            </label>
            <button
              className="api-test-grad-bg h-11 rounded-xl px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              disabled={working}
              type="button"
              onClick={runAllTests}
            >
              {working ? 'Running...' : 'Run API Test Suite'}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3 text-xs text-indigo-200">
            <p>Created email: {createdEmail || '-'}</p>
            <p>Password used: {createdPassword}</p>
            {note ? <p className="mt-1 text-amber-300">{note}</p> : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">Pass: {summary.pass}</span>
            <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300">Fail: {summary.fail}</span>
            <span className="rounded-full border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-slate-300">Skipped: {summary.skipped}</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-slate-200">Total: {summary.total}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {results.map((result, index) => (
            <div key={`${result.name}-${index}`} className="api-test-card rounded-xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{result.name}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    result.status === 'pass'
                      ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : result.status === 'fail'
                        ? 'border border-red-500/40 bg-red-500/10 text-red-300'
                        : 'border border-slate-500/40 bg-slate-500/10 text-slate-300'
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <pre className="api-test-pre overflow-x-auto rounded-lg border border-white/10 bg-slate-950/80 p-3 text-xs text-slate-300">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
