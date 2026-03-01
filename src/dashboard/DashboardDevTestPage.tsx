import { useState } from 'react'

import { ApiError, getDashboardChatbots, getDashboardKbFiles, getDashboardSummary, getMe } from '../lib/api'
import './DashboardDevTestPage.css'

type TestResult = {
  name: string
  status: 'pass' | 'fail'
  payload: unknown
}

export function DashboardDevTestPage() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const push = (result: TestResult) => {
    setResults((current) => [...current, result])
    console.log('[dashboard-dev-test]', result)
  }

  const runTests = async () => {
    setRunning(true)
    setResults([])

    try {
      const me = await getMe()
      push({ name: 'GET /api/auth/me', status: 'pass', payload: me })
    } catch (error) {
      push({ name: 'GET /api/auth/me', status: 'fail', payload: error })
    }

    try {
      const summary = await getDashboardSummary()
      push({ name: 'GET /api/dashboard/summary', status: 'pass', payload: summary })
    } catch (error) {
      push({ name: 'GET /api/dashboard/summary', status: 'fail', payload: error })
    }

    try {
      const chatbots = await getDashboardChatbots()
      push({ name: 'GET /api/dashboard/chatbots', status: 'pass', payload: chatbots })

      if (chatbots.chatbots.length > 0) {
        const kbFiles = await getDashboardKbFiles(chatbots.chatbots[0].id)
        push({ name: 'GET /api/dashboard/chatbots/:id/kb-files', status: 'pass', payload: kbFiles })
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : error
      push({ name: 'GET /api/dashboard/chatbots', status: 'fail', payload: message })
    }

    setRunning(false)
  }

  return (
    <div className="dashboard-dev-test space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Dashboard API Dev Test</h1>
        <p className="text-sm text-slate-400">Runs core authenticated dashboard API checks in browser.</p>
      </div>

      <button
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={running}
        type="button"
        onClick={runTests}
      >
        {running ? 'Running...' : 'Run Tests'}
      </button>

      <div className="space-y-3">
        {results.map((result, index) => (
          <article key={`${result.name}-${index}`} className="dev-test-result rounded-xl border border-white/10 bg-slate-900/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{result.name}</p>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  result.status === 'pass'
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border border-red-500/40 bg-red-500/10 text-red-300'
                }`}
              >
                {result.status}
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950/80 p-2 text-xs text-slate-300">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </article>
        ))}
      </div>
    </div>
  )
}
