import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { RequireChatbot } from '../components/RequireChatbot'
import {
  ApiError,
  getDashboardChatbots,
  getDashboardSummary,
  type DashboardChatbot,
  type DashboardSummary,
} from '../lib/api'
import { useAuth } from '../lib/auth-context'
import { readDashboardSetupProgress } from '../lib/dashboard-setup-progress'
import { formatDateTime } from '../lib/utils'
import './DashboardOverviewPage.css'

const EMPTY_SUMMARY: DashboardSummary = {
  messages_used_this_period: 0,
  total_messages_lifetime: 0,
  plan: 'free',
  integrations_used: 0,
  integration_limit: 1,
  tickets_open: 0,
}

export function DashboardOverviewPage() {
  const { plan, isAdmin, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [loadingChatbotCheck, setLoadingChatbotCheck] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_SUMMARY)
  const [hasChatbot, setHasChatbot] = useState(true)
  const [setupChatbots, setSetupChatbots] = useState<DashboardChatbot[]>([])
  const [recentSessions, setRecentSessions] = useState<Array<{ session_id: string; messages: Array<Record<string, unknown>> }>>([])

  const currentPlanCode = typeof plan?.code === 'string' ? plan.code.toLowerCase() : 'free'
  const shouldShowRecentSessions = isAdmin || currentPlanCode !== 'free'
  const messageCapHint = useMemo(() => {
    if (isAdmin) {
      return 'Unlimited'
    }

    if (currentPlanCode === 'free') {
      return '10 lifetime messages'
    }

    if (plan?.monthly_message_cap == null) {
      return 'Unlimited monthly messages'
    }

    return `${plan.monthly_message_cap} messages per period`
  }, [currentPlanCode, isAdmin, plan?.monthly_message_cap])

  useEffect(() => {
    let mounted = true

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getDashboardSummary()
        if (!mounted) {
          return
        }

        setSummary(response.summary)
        setRecentSessions((response.recent_sessions ?? []) as Array<{ session_id: string; messages: Array<Record<string, unknown>> }>)
      } catch (loadError) {
        if (!mounted) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load dashboard summary.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    if (!user?.id) {
      setHasChatbot(false)
      setSetupChatbots([])
      setLoadingChatbotCheck(false)
      return () => {
        mounted = false
      }
    }

    void (async () => {
      setLoadingChatbotCheck(true)
      try {
        const response = await getDashboardChatbots()
        if (!mounted) {
          return
        }
        setHasChatbot(response.chatbots.length > 0)
        setSetupChatbots(response.chatbots)
      } catch {
        if (!mounted) {
          return
        }
        // Keep overview resilient if chatbot lookup fails temporarily.
        setHasChatbot(true)
        setSetupChatbots([])
      } finally {
        if (mounted) {
          setLoadingChatbotCheck(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [user?.id])

  const setupSteps = useMemo(() => {
    const setupProgress = readDashboardSetupProgress(user?.id)
    const hasIntegration = setupChatbots.length > 0 || summary.integrations_used > 0
    const hasWebsite = setupChatbots.some((chatbot) => Boolean(chatbot.website_url?.trim()))
    const hasAnyConversation = summary.total_messages_lifetime > 0 || recentSessions.length > 0

    return [
      {
        id: 'integration',
        title: 'Create Your First Integration',
        detail: 'Add chatbot name and website details in Integrations.',
        done: hasIntegration,
        to: '/dashboard/integrations',
        cta: 'Open Integrations',
      },
      {
        id: 'sync',
        title: 'Sync Website',
        detail: 'Run website sync so your chatbot can answer from your pages.',
        done: hasIntegration && hasWebsite && setupProgress.syncedWebsite,
        to: '/dashboard/integrations',
        cta: 'Sync Website',
      },
      {
        id: 'snippet',
        title: 'Load Snippet',
        detail: 'Load and copy your embed snippet to install on your website.',
        done: hasIntegration && setupProgress.loadedSnippet,
        to: '/dashboard/integrations',
        cta: 'Load Snippet',
      },
      {
        id: 'testing',
        title: 'Test Chatbot',
        detail: 'Test responses before going live.',
        done: setupProgress.testedAssistant || hasAnyConversation,
        to: '/dashboard/test-chat',
        cta: 'Run Test Chat',
      },
    ] as const
  }, [recentSessions.length, setupChatbots, summary.integrations_used, summary.total_messages_lifetime, user?.id])

  const completedSteps = setupSteps.filter((step) => step.done).length
  const progressPercent = Math.round((completedSteps / setupSteps.length) * 100)
  const nextStep = setupSteps.find((step) => !step.done) ?? null

  return (
    <div className="dashboard-overview space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-slate-400">Usage, integrations, and recent chatbot sessions.</p>
        </div>
        <Link
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          to="/dashboard/integrations"
        >
          Manage Integrations
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 via-slate-900/80 to-sky-500/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Setup Progress</p>
            <h2 className="mt-1 text-xl font-black text-white">
              {completedSteps}/{setupSteps.length} steps complete
            </h2>
          </div>
          <span className="rounded-full border border-indigo-400/35 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-100">
            {progressPercent}% done
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {setupSteps.map((step) => (
            <Link
              key={step.id}
              className={[
                'group rounded-xl border px-3 py-2 transition-colors',
                step.done
                  ? 'border-emerald-500/35 bg-emerald-500/10 hover:bg-emerald-500/15'
                  : 'border-white/10 bg-slate-900/60 hover:bg-slate-800/70',
              ].join(' ')}
              to={step.to}
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    'material-symbols-outlined text-[18px]',
                    step.done ? 'text-emerald-300' : 'text-slate-400',
                  ].join(' ')}
                >
                  {step.done ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <p className="text-sm font-semibold text-white">{step.title}</p>
              </div>
              <p className="mt-1 text-xs text-slate-300">{step.detail}</p>
            </Link>
          ))}
        </div>

        {nextStep ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5">
            <div>
              <p className="text-xs uppercase tracking-wide text-sky-200">Next Best Action</p>
              <p className="text-sm font-semibold text-white">{nextStep.title}</p>
            </div>
            <Link
              className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500"
              to={nextStep.to}
            >
              {nextStep.cta}
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-100">
            You have completed the basic setup. Your chatbot is ready to go live.
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Plan</p>
          <p className="mt-2 text-2xl font-black capitalize text-white">{loading ? '-' : summary.plan}</p>
          <p className="mt-1 text-xs text-slate-500">{messageCapHint}</p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Messages This Period</p>
          <p className="mt-2 text-2xl font-black text-white">
            {loading ? '-' : summary.messages_used_this_period.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Integrations Used</p>
          <p className="mt-2 text-2xl font-black text-white">
            {loading ? '-' : `${summary.integrations_used}/${summary.integration_limit}`}
          </p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Open Tickets</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : summary.tickets_open}</p>
        </div>
      </div>

      {shouldShowRecentSessions ? (
        loadingChatbotCheck ? (
          <section className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Loading chatbots...</p>
          </section>
        ) : (
          <RequireChatbot hasChatbot={hasChatbot}>
            <section className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white">Recent Chat Sessions</h2>
                <span className="text-xs text-slate-400">Latest {recentSessions.length}</span>
              </div>

              <div className="space-y-3">
                {recentSessions.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-sm text-slate-300">{loading ? 'Loading sessions...' : 'No chat sessions yet.'}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Send a message from Test Chat or your live website widget to start seeing session logs.
                    </p>
                    <Link
                      className="mt-2 inline-flex rounded-lg border border-indigo-500/35 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/20"
                      to="/dashboard/test-chat"
                    >
                      Open Test Chat
                    </Link>
                  </div>
                ) : (
                  recentSessions.map((session) => {
                    const latestMessage = session.messages[0]
                    const latestText =
                      typeof latestMessage?.content === 'string'
                        ? latestMessage.content
                        : 'No content'
                    const latestCreatedAt =
                      typeof latestMessage?.created_at === 'string'
                        ? latestMessage.created_at
                        : null

                    return (
                      <div key={session.session_id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{session.session_id}</p>
                        <p className="mt-1 text-sm text-slate-200 line-clamp-2">{latestText}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {latestCreatedAt ? formatDateTime(latestCreatedAt) : 'Timestamp unavailable'}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </section>
          </RequireChatbot>
        )
      ) : null}
    </div>
  )
}
