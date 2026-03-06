import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../lib/auth-context'
import { markDashboardSetupProgress } from '../lib/dashboard-setup-progress'
import { brandChatLogoSrc } from '../lib/brand'
import {
  ApiError,
  deleteDashboardChatbot,
  deleteDashboardChatbotLogo,
  getDashboardChatbotLogo,
  getDashboardChatbots,
  getDashboardEmbed,
  getDashboardWhatsAppIntegration,
  getRagIngestLatest,
  getRagIngestStatus,
  postDashboardWhatsAppConnect,
  postDashboardChatbot,
  postDashboardChatbotLogo,
  postDashboardWhatsAppTestMessage,
  postRagIngestCancel,
  postRagIngestResync,
  postRagIngestStart,
  deleteDashboardWhatsAppIntegration,
  type DashboardChatbot,
  type DashboardWhatsAppIntegration,
  type RagIngestionRun,
} from '../lib/api'
import './DashboardIntegrationsPage.css'

const STARTER_PLUS_PLANS = new Set(['starter', 'pro', 'business'])
const DEFAULT_SYNC_MAX_PAGES = 60

export function DashboardIntegrationsPage() {
  const { user, plan, isAdmin } = useAuth()
  const currentPlanCode = typeof plan?.code === 'string' ? plan.code.toLowerCase() : 'free'
  const canUploadAssets = useMemo(() => {
    if (isAdmin) {
      return true
    }

    return STARTER_PLUS_PLANS.has(currentPlanCode)
  }, [currentPlanCode, isAdmin])
  const integrationLimit = useMemo(() => {
    if (isAdmin) {
      return Number.MAX_SAFE_INTEGER
    }

    if (typeof plan?.chatbot_limit === 'number' && plan.chatbot_limit > 0) {
      return plan.chatbot_limit
    }

    return currentPlanCode === 'business' ? 10 : 1
  }, [currentPlanCode, isAdmin, plan?.chatbot_limit])

  const [chatbots, setChatbots] = useState<DashboardChatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [snippetMap, setSnippetMap] = useState<Record<string, string>>({})
  const [copiedSnippetByChatbot, setCopiedSnippetByChatbot] = useState<Record<string, boolean>>({})
  const [logoUrlByChatbot, setLogoUrlByChatbot] = useState<Record<string, string | null>>({})
  const [logoBusyByChatbot, setLogoBusyByChatbot] = useState<Record<string, boolean>>({})
  const [ragRunByChatbot, setRagRunByChatbot] = useState<Record<string, string>>({})
  const [ragStatusByRun, setRagStatusByRun] = useState<Record<string, RagIngestionRun>>({})
  const [ragActionBusy, setRagActionBusy] = useState<Record<string, boolean>>({})
  const [ragUrlsText, setRagUrlsText] = useState('')
  const [toast, setToast] = useState<{ message: string; tone: 'info' | 'success' | 'error' } | null>(null)
  const [whatsAppLoading, setWhatsAppLoading] = useState(true)
  const [whatsAppSaving, setWhatsAppSaving] = useState(false)
  const [whatsAppTesting, setWhatsAppTesting] = useState(false)
  const [whatsAppDisconnecting, setWhatsAppDisconnecting] = useState(false)
  const [whatsAppWebhookUrl, setWhatsAppWebhookUrl] = useState('')
  const [whatsAppIntegration, setWhatsAppIntegration] = useState<DashboardWhatsAppIntegration | null>(null)
  const [whatsAppForm, setWhatsAppForm] = useState({
    chatbotId: '',
    phoneNumberId: '',
    businessAccountId: '',
    displayPhoneNumber: '',
    accessToken: '',
    verifyToken: '',
    webhookSecret: '',
    isActive: true,
  })
  const [whatsAppTestTo, setWhatsAppTestTo] = useState('')
  const [whatsAppTestMessage, setWhatsAppTestMessage] = useState('Hi! This is a WhatsApp test message from Kufu.')
  const copyResetTimersRef = useRef<Record<string, number>>({})
  const toastResetTimerRef = useRef<number | null>(null)
  const isIntegrationLimitReached = !isAdmin && chatbots.length >= integrationLimit
  const isFreeLimitReached = currentPlanCode === 'free' && isIntegrationLimitReached

  const showToast = useCallback((message: string, tone: 'info' | 'success' | 'error' = 'info') => {
    if (toastResetTimerRef.current) {
      window.clearTimeout(toastResetTimerRef.current)
    }

    setToast({ message, tone })
    toastResetTimerRef.current = window.setTimeout(() => {
      setToast(null)
      toastResetTimerRef.current = null
    }, 2400)
  }, [])

  const loadChatbotLogos = async (items: DashboardChatbot[]) => {
    if (items.length === 0) {
      setLogoUrlByChatbot({})
      return
    }

    const logoEntries = await Promise.all(
      items.map(async (chatbot) => {
        if (!chatbot.logo_path) {
          return [chatbot.id, null] as const
        }

        try {
          const logoResponse = await getDashboardChatbotLogo(chatbot.id)
          return [chatbot.id, logoResponse.logoUrl] as const
        } catch {
          return [chatbot.id, null] as const
        }
      }),
    )

    setLogoUrlByChatbot(Object.fromEntries(logoEntries))
  }

  const loadChatbots = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getDashboardChatbots()
      setChatbots(response.chatbots)
      await loadChatbotLogos(response.chatbots)

      const latestRuns = await Promise.all(
        response.chatbots.map(async (chatbot) => {
          try {
            const latest = await getRagIngestLatest(chatbot.id)
            return [chatbot.id, latest.run] as const
          } catch {
            return [chatbot.id, null] as const
          }
        }),
      )

      const nextRunByChatbot: Record<string, string> = {}
      const nextStatusByRun: Record<string, RagIngestionRun> = {}
      for (const [chatbotId, run] of latestRuns) {
        if (!run) {
          continue
        }
        nextRunByChatbot[chatbotId] = run.runId
        nextStatusByRun[run.runId] = run
      }

      setRagRunByChatbot(nextRunByChatbot)
      setRagStatusByRun(nextStatusByRun)
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load chatbots.')
    } finally {
      setLoading(false)
    }
  }

  const loadWhatsAppIntegration = async () => {
    setWhatsAppLoading(true)
    try {
      const response = await getDashboardWhatsAppIntegration()
      setWhatsAppWebhookUrl(response.webhookUrl)
      setWhatsAppIntegration(response.integration)
      setWhatsAppForm((current) => ({
        ...current,
        chatbotId: response.integration?.chatbot_id ?? current.chatbotId,
        phoneNumberId: response.integration?.phone_number_id ?? '',
        businessAccountId: response.integration?.business_account_id ?? '',
        displayPhoneNumber: response.integration?.display_phone_number ?? '',
        verifyToken: response.integration?.verify_token ?? '',
        accessToken: '',
        isActive: response.integration?.is_active ?? true,
      }))
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load WhatsApp integration.')
    } finally {
      setWhatsAppLoading(false)
    }
  }

  useEffect(() => {
    void loadChatbots()
    void loadWhatsAppIntegration()
  }, [])

  useEffect(() => {
    if (whatsAppForm.chatbotId || chatbots.length === 0) {
      return
    }

    setWhatsAppForm((current) => ({
      ...current,
      chatbotId: chatbots[0]?.id ?? '',
    }))
  }, [chatbots, whatsAppForm.chatbotId])

  useEffect(() => {
    return () => {
      Object.values(copyResetTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId)
      })
      if (toastResetTimerRef.current) {
        window.clearTimeout(toastResetTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const runIdsToPoll = Object.values(ragRunByChatbot).filter((runId) => {
      const status = ragStatusByRun[runId]?.status
      return !status || status === 'running'
    })

    if (runIdsToPoll.length === 0) {
      return
    }

    let isActive = true
    const pollOnce = async () => {
      await Promise.all(
        runIdsToPoll.map(async (runId) => {
          try {
            const response = await getRagIngestStatus(runId)
            if (!isActive) {
              return
            }

            setRagStatusByRun((current) => ({
              ...current,
              [runId]: response.run,
            }))
          } catch {
            // Keep UI resilient during transient polling errors.
          }
        }),
      )
    }

    void pollOnce()
    const timer = window.setInterval(() => {
      void pollOnce()
    }, 4000)

    return () => {
      isActive = false
      window.clearInterval(timer)
    }
  }, [ragRunByChatbot, ragStatusByRun])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (isIntegrationLimitReached) {
      setError(`Integration limit reached (${integrationLimit}). Upgrade your plan to add more integrations.`)
      showToast('Integration limit reached. Upgrade to add more.', 'info')
      return
    }

    if (!newName.trim()) {
      setError('Chatbot name is required.')
      return
    }

    setCreating(true)
    try {
      await postDashboardChatbot({
        name: newName.trim(),
        website_url: newWebsiteUrl.trim() || null,
      })
      setNewName('')
      setNewWebsiteUrl('')
      await loadChatbots()
    } catch (createError) {
      setError(createError instanceof ApiError ? createError.message : 'Failed to create chatbot.')
    } finally {
      setCreating(false)
    }
  }

  const removeChatbot = async (chatbotId: string) => {
    setError(null)
    try {
      await deleteDashboardChatbot(chatbotId)
      setChatbots((current) => current.filter((item) => item.id !== chatbotId))
      setLogoUrlByChatbot((current) => {
        const next = { ...current }
        delete next[chatbotId]
        return next
      })
      setSnippetMap((current) => {
        const next = { ...current }
        delete next[chatbotId]
        return next
      })
      setCopiedSnippetByChatbot((current) => {
        const next = { ...current }
        delete next[chatbotId]
        return next
      })
      const resetTimer = copyResetTimersRef.current[chatbotId]
      if (resetTimer) {
        window.clearTimeout(resetTimer)
        delete copyResetTimersRef.current[chatbotId]
      }
    } catch (deleteError) {
      setError(deleteError instanceof ApiError ? deleteError.message : 'Failed to delete chatbot.')
    }
  }

  const loadSnippet = async (chatbotId: string) => {
    setError(null)
    try {
      const response = await getDashboardEmbed(chatbotId)
      setSnippetMap((current) => ({ ...current, [chatbotId]: response.snippet }))
      setCopiedSnippetByChatbot((current) => ({ ...current, [chatbotId]: false }))
      markDashboardSetupProgress(user?.id, { loadedSnippet: true })
    } catch (snippetError) {
      setError(snippetError instanceof ApiError ? snippetError.message : 'Failed to load embed snippet.')
    }
  }

  const copySnippet = async (chatbotId: string, snippet: string) => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopiedSnippetByChatbot((current) => ({ ...current, [chatbotId]: true }))

      const existingTimer = copyResetTimersRef.current[chatbotId]
      if (existingTimer) {
        window.clearTimeout(existingTimer)
      }

      copyResetTimersRef.current[chatbotId] = window.setTimeout(() => {
        setCopiedSnippetByChatbot((current) => ({ ...current, [chatbotId]: false }))
        delete copyResetTimersRef.current[chatbotId]
      }, 1800)
    } catch {
      setError('Failed to copy snippet. Please copy it manually.')
    }
  }

  const handleLogoUploadChange = async (chatbotId: string, event: ChangeEvent<HTMLInputElement>) => {
    const targetFile = event.target.files?.[0]
    event.target.value = ''
    if (!targetFile) {
      return
    }

    setError(null)
    setLogoBusyByChatbot((current) => ({ ...current, [chatbotId]: true }))
    try {
      const response = await postDashboardChatbotLogo(chatbotId, targetFile)
      setLogoUrlByChatbot((current) => ({ ...current, [chatbotId]: response.logoUrl }))
    } catch (uploadError) {
      setError(uploadError instanceof ApiError ? uploadError.message : 'Failed to upload chatbot logo.')
    } finally {
      setLogoBusyByChatbot((current) => ({ ...current, [chatbotId]: false }))
    }
  }

  const handleRemoveLogo = async (chatbotId: string) => {
    setError(null)
    setLogoBusyByChatbot((current) => ({ ...current, [chatbotId]: true }))
    try {
      await deleteDashboardChatbotLogo(chatbotId)
      setLogoUrlByChatbot((current) => ({ ...current, [chatbotId]: null }))
    } catch (removeError) {
      setError(removeError instanceof ApiError ? removeError.message : 'Failed to remove chatbot logo.')
    } finally {
      setLogoBusyByChatbot((current) => ({ ...current, [chatbotId]: false }))
    }
  }

  const triggerIngestion = async (chatbot: DashboardChatbot, mode: 'start' | 'resync') => {
    setError(null)
    const websiteUrl = chatbot.website_url?.trim() ?? ''
    if (!websiteUrl) {
      setError('Set a website URL for this chatbot before syncing.')
      return
    }

    setRagActionBusy((current) => ({ ...current, [chatbot.id]: true }))
    try {
      const urls = ragUrlsText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const payload = {
        chatbotId: chatbot.id,
        websiteUrl,
        maxPages: DEFAULT_SYNC_MAX_PAGES,
        urls,
      }

      const response =
        mode === 'resync'
          ? await postRagIngestResync(payload)
          : await postRagIngestStart(payload)

      setRagRunByChatbot((current) => ({
        ...current,
        [chatbot.id]: response.runId,
      }))
      setRagStatusByRun((current) => ({
        ...current,
        [response.runId]: {
          runId: response.runId,
          chatbotId: chatbot.id,
          status: 'running',
          pagesFound: 0,
          pagesCrawled: 0,
          chunksWritten: 0,
          error: null,
          cancelRequested: false,
          startedAt: new Date().toISOString(),
          finishedAt: null,
          updatedAt: new Date().toISOString(),
        },
      }))
      markDashboardSetupProgress(user?.id, { syncedWebsite: true })
      showToast(
        mode === 'resync'
          ? `${chatbot.name}: re-sync started.`
          : `${chatbot.name}: website sync started.`,
        'success',
      )
    } catch (ingestError) {
      setError(ingestError instanceof ApiError ? ingestError.message : 'Failed to start website sync.')
      showToast('Could not start sync. Please try again.', 'error')
    } finally {
      setRagActionBusy((current) => ({ ...current, [chatbot.id]: false }))
    }
  }

  const cancelIngestion = async (chatbotId: string) => {
    setError(null)
    const runId = ragRunByChatbot[chatbotId]
    if (!runId) {
      return
    }

    setRagActionBusy((current) => ({ ...current, [chatbotId]: true }))
    try {
      await postRagIngestCancel(runId)
      showToast('Sync cancellation requested.', 'info')
    } catch (cancelError) {
      setError(cancelError instanceof ApiError ? cancelError.message : 'Failed to cancel sync.')
      showToast('Could not cancel sync. Please try again.', 'error')
    } finally {
      setRagActionBusy((current) => ({ ...current, [chatbotId]: false }))
    }
  }

  const handleWhatsAppConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!whatsAppForm.chatbotId) {
      setError('Select a chatbot before connecting WhatsApp.')
      return
    }

    if (!whatsAppForm.phoneNumberId.trim()) {
      setError('WhatsApp Phone Number ID is required.')
      return
    }

    setWhatsAppSaving(true)
    try {
      const response = await postDashboardWhatsAppConnect({
        chatbotId: whatsAppForm.chatbotId,
        phoneNumberId: whatsAppForm.phoneNumberId.trim(),
        businessAccountId: whatsAppForm.businessAccountId.trim(),
        displayPhoneNumber: whatsAppForm.displayPhoneNumber.trim(),
        accessToken: whatsAppForm.accessToken.trim(),
        verifyToken: whatsAppForm.verifyToken.trim(),
        webhookSecret: whatsAppForm.webhookSecret.trim(),
        isActive: whatsAppForm.isActive,
      })

      setWhatsAppWebhookUrl(response.webhookUrl)
      setWhatsAppIntegration(response.integration)
      setWhatsAppForm((current) => ({
        ...current,
        chatbotId: response.integration.chatbot_id,
        phoneNumberId: response.integration.phone_number_id,
        businessAccountId: response.integration.business_account_id ?? '',
        displayPhoneNumber: response.integration.display_phone_number ?? '',
        verifyToken: response.integration.verify_token,
        accessToken: '',
        isActive: response.integration.is_active,
      }))
      showToast('WhatsApp integration saved. Configure webhook verify in Meta dashboard.', 'success')
    } catch (connectError) {
      setError(connectError instanceof ApiError ? connectError.message : 'Failed to connect WhatsApp.')
      showToast('WhatsApp connection failed.', 'error')
    } finally {
      setWhatsAppSaving(false)
    }
  }

  const handleWhatsAppDisconnect = async () => {
    setError(null)
    setWhatsAppDisconnecting(true)
    try {
      await deleteDashboardWhatsAppIntegration()
      setWhatsAppIntegration(null)
      setWhatsAppForm((current) => ({
        ...current,
        phoneNumberId: '',
        businessAccountId: '',
        displayPhoneNumber: '',
        verifyToken: '',
        accessToken: '',
        webhookSecret: '',
        isActive: true,
      }))
      showToast('WhatsApp integration disconnected.', 'info')
    } catch (disconnectError) {
      setError(disconnectError instanceof ApiError ? disconnectError.message : 'Failed to disconnect WhatsApp.')
      showToast('Could not disconnect WhatsApp integration.', 'error')
    } finally {
      setWhatsAppDisconnecting(false)
    }
  }

  const handleWhatsAppSendTest = async () => {
    setError(null)
    if (!whatsAppTestTo.trim()) {
      setError('Enter a recipient WhatsApp number for test message.')
      return
    }

    if (!whatsAppTestMessage.trim()) {
      setError('Test message cannot be empty.')
      return
    }

    setWhatsAppTesting(true)
    try {
      await postDashboardWhatsAppTestMessage({
        to: whatsAppTestTo.trim(),
        message: whatsAppTestMessage.trim(),
      })
      showToast('Test WhatsApp message sent successfully.', 'success')
    } catch (testError) {
      setError(testError instanceof ApiError ? testError.message : 'Failed to send test WhatsApp message.')
      showToast('Failed to send test WhatsApp message.', 'error')
    } finally {
      setWhatsAppTesting(false)
    }
  }

  return (
    <div className="dashboard-integrations space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Integrations</h1>
        <p className="text-sm text-slate-400">Create chatbots, manage logos, and copy installation snippets.</p>
      </div>

      <section className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/15 via-slate-900/70 to-cyan-500/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Quick Setup Path</p>
            <p className="mt-1 text-sm text-slate-200">
              1. Create integration  2. Sync website  3. Load snippet  4. Test chatbot
            </p>
          </div>
          <button
            className="rounded-lg border border-indigo-400/35 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/25"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Here
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white">WhatsApp Automation</h2>
            <p className="mt-1 text-xs text-slate-400">
              Connect Meta WhatsApp Cloud API to auto-reply using your chatbot knowledge base.
            </p>
          </div>
          {whatsAppIntegration ? (
            <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
              Connected
            </span>
          ) : (
            <span className="rounded-full border border-slate-500/35 bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Not Connected
            </span>
          )}
        </div>

        {whatsAppLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading WhatsApp integration...</p>
        ) : (
          <>
            <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={handleWhatsAppConnect}>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Chatbot</span>
                <select
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  value={whatsAppForm.chatbotId}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, chatbotId: event.target.value }))
                  }
                >
                  {chatbots.length === 0 ? <option value="">No chatbot available</option> : null}
                  {chatbots.map((chatbot) => (
                    <option key={chatbot.id} value={chatbot.id}>
                      {chatbot.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Phone Number ID</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder="e.g. 123456789012345"
                  type="text"
                  value={whatsAppForm.phoneNumberId}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, phoneNumberId: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Business Account ID</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder="Optional"
                  type="text"
                  value={whatsAppForm.businessAccountId}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, businessAccountId: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Display Phone Number</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder="Optional"
                  type="text"
                  value={whatsAppForm.displayPhoneNumber}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, displayPhoneNumber: event.target.value }))
                  }
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Access Token</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder={
                    whatsAppIntegration
                      ? 'Leave blank to keep existing access token'
                      : 'Paste your permanent WhatsApp access token'
                  }
                  type="password"
                  value={whatsAppForm.accessToken}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, accessToken: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Verify Token</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder="Auto-generated if left blank"
                  type="text"
                  value={whatsAppForm.verifyToken}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, verifyToken: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Webhook Secret</span>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder="Optional (for signature validation)"
                  type="text"
                  value={whatsAppForm.webhookSecret}
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, webhookSecret: event.target.value }))
                  }
                />
              </label>

              <label className="mt-1 inline-flex items-center gap-2 text-xs text-slate-300 md:col-span-2">
                <input
                  checked={whatsAppForm.isActive}
                  className="rounded border-white/20 bg-white/10"
                  type="checkbox"
                  onChange={(event) =>
                    setWhatsAppForm((current) => ({ ...current, isActive: event.target.checked }))
                  }
                />
                Integration active
              </label>

              <div className="flex flex-wrap items-center gap-2 md:col-span-2">
                <button
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={whatsAppSaving || chatbots.length === 0}
                  type="submit"
                >
                  {whatsAppSaving ? 'Saving...' : 'Save WhatsApp Integration'}
                </button>
                {whatsAppIntegration ? (
                  <button
                    className="rounded-lg border border-rose-500/35 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={whatsAppDisconnecting}
                    type="button"
                    onClick={handleWhatsAppDisconnect}
                  >
                    {whatsAppDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                ) : null}
              </div>
            </form>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Webhook URL</p>
                <p className="mt-1 break-all text-xs text-slate-200">{whatsAppWebhookUrl || '-'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Verify Token</p>
                <p className="mt-1 break-all text-xs text-slate-200">
                  {whatsAppIntegration?.verify_token || whatsAppForm.verifyToken || '-'}
                </p>
              </div>
            </div>

            {whatsAppIntegration ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Send Test Message</p>
                <div className="mt-2 grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                  <input
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                    placeholder="Recipient number (e.g. 9198xxxxxx)"
                    type="text"
                    value={whatsAppTestTo}
                    onChange={(event) => setWhatsAppTestTo(event.target.value)}
                  />
                  <input
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                    placeholder="Test message"
                    type="text"
                    value={whatsAppTestMessage}
                    onChange={(event) => setWhatsAppTestMessage(event.target.value)}
                  />
                  <button
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={whatsAppTesting}
                    type="button"
                    onClick={handleWhatsAppSendTest}
                  >
                    {whatsAppTesting ? 'Sending...' : 'Send Test'}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Last inbound: {whatsAppIntegration.last_inbound_at || 'No incoming WhatsApp message yet'}
                </p>
              </div>
            ) : null}
          </>
        )}
      </section>

      {!isAdmin && currentPlanCode === 'free' && chatbots.length > 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Upgrade to Starter or above to upload chatbot logo
        </div>
      ) : null}

      {isIntegrationLimitReached ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-200">
            {isFreeLimitReached
              ? 'Free plan includes 1 integration. Upgrade your plan to add more integrations.'
              : `You have reached your integration limit (${integrationLimit}). Upgrade to add more integrations.`}
          </p>
          <Link
            className="rounded-lg border border-amber-300/40 bg-amber-400/20 px-3 py-1.5 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-400/30"
            to="/dashboard/upgrade"
          >
            Upgrade Plan
          </Link>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {toast ? (
        <div
          className={`rounded-xl border px-4 py-2 text-sm ${
            toast.tone === 'success'
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
              : toast.tone === 'error'
                ? 'border-rose-500/35 bg-rose-500/10 text-rose-200'
                : 'border-sky-500/35 bg-sky-500/10 text-sky-200'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      {!isIntegrationLimitReached ? (
        <form className="integrations-create rounded-2xl border border-white/10 bg-slate-900/70 p-4" onSubmit={handleCreate}>
          <h2 className="text-sm font-semibold text-white">Create Integration</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              placeholder="Chatbot name"
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
            <input
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              placeholder="https://example.com"
              type="url"
              value={newWebsiteUrl}
              onChange={(event) => setNewWebsiteUrl(event.target.value)}
            />
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={creating}
              type="submit"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
          <div className="mt-2 grid gap-2 text-[11px] text-slate-400 md:grid-cols-2">
            <p>Tip: use a clear bot name like <span className="font-semibold text-slate-300">Sales Assistant</span>.</p>
            <p>Tip: website URL should be your public homepage for better crawling.</p>
          </div>
          <div className="mt-3 space-y-2">
            <label className="text-xs text-slate-400" htmlFor="rag-urls-input">
              Optional additional page URLs to crawl (one URL per line, public pages only)
            </label>
            <textarea
              className="min-h-[90px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200"
              id="rag-urls-input"
              placeholder={'https://example.com/pricing\nhttps://example.com/blog/how-it-works'}
              value={ragUrlsText}
              onChange={(event) => setRagUrlsText(event.target.value)}
            />
            <p className="text-[11px] text-slate-500">
              Use this to include specific extra pages in the crawl in addition to the main website URL.
            </p>
            <p className="text-[11px] text-slate-500">
              For private/dashboard pages that require login, add content in Knowledge Base instead.
            </p>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading integrations...</p>
        ) : chatbots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-6 text-center">
            <p className="text-sm font-semibold text-slate-200">No integrations yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Create your first chatbot integration above, then copy and install the snippet on your website.
            </p>
          </div>
        ) : (
          chatbots.map((chatbot) => {
            const runId = ragRunByChatbot[chatbot.id]
            const run = runId ? ragStatusByRun[runId] : null
            const logoUrl = logoUrlByChatbot[chatbot.id] ?? null
            const displayLogoUrl = logoUrl || brandChatLogoSrc
            const logoBusy = Boolean(logoBusyByChatbot[chatbot.id])
            const uploadInputId = `chatbot-logo-${chatbot.id}`
            const hasWebsite = Boolean(chatbot.website_url?.trim())
            const hasAllowedDomains = chatbot.allowed_domains.length > 0
            const snippetLoaded = Boolean(snippetMap[chatbot.id])
            const hasLogo = Boolean(logoUrl)
            const actionBusy = Boolean(ragActionBusy[chatbot.id])
            const syncStatusLabel =
              run?.status === 'done'
                ? 'Synced'
                : run?.status === 'running'
                  ? 'Syncing'
                  : run?.status === 'failed'
                    ? 'Sync Failed'
                    : 'Not Synced'

            return (
              <article key={chatbot.id} className="integration-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                {run ? (
                  <div className="rag-status-box mb-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-100">
                    <p>
                      Sync status: <strong className="uppercase">{run.status}</strong> | Pages: {run.pagesCrawled}/
                      {run.pagesFound || '?'} | Chunks: {run.chunksWritten}
                    </p>
                    {run.error ? <p className="mt-1 text-red-200">Error: {run.error}</p> : null}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="integration-logo-shell flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/80">
                      {displayLogoUrl ? (
                        <img alt={`${chatbot.name} logo`} className="h-11 w-11 object-contain" src={displayLogoUrl} />
                      ) : (
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">No Logo</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{chatbot.name}</h3>
                      <p className="text-xs text-slate-400">{chatbot.website_url || 'No website URL configured'}</p>
                      <p className="mt-1 text-xs text-slate-500">Public key: {chatbot.widget_public_key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                      type="button"
                      onClick={() => removeChatbot(chatbot.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    chatbot.is_active
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/35 bg-rose-500/10 text-rose-200'
                  }`}>
                    {chatbot.is_active ? 'Live' : 'Paused'}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    hasWebsite
                      ? 'border-sky-500/35 bg-sky-500/10 text-sky-200'
                      : 'border-amber-500/35 bg-amber-500/10 text-amber-200'
                  }`}>
                    {hasWebsite ? 'Website Linked' : 'Website Missing'}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    hasAllowedDomains
                      ? 'border-indigo-500/35 bg-indigo-500/10 text-indigo-200'
                      : 'border-amber-500/35 bg-amber-500/10 text-amber-200'
                  }`}>
                    {hasAllowedDomains ? 'Domain Guard Set' : 'Domain Guard Open'}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    hasLogo
                      ? 'border-violet-500/35 bg-violet-500/10 text-violet-200'
                      : 'border-slate-500/35 bg-slate-800/70 text-slate-300'
                  }`}>
                    {hasLogo ? 'Logo Uploaded' : 'Default Logo'}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    snippetLoaded
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-500/35 bg-slate-800/70 text-slate-300'
                  }`}>
                    {snippetLoaded ? 'Snippet Ready' : 'Load Snippet'}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    syncStatusLabel === 'Synced'
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                      : syncStatusLabel === 'Syncing'
                        ? 'border-sky-500/35 bg-sky-500/10 text-sky-200'
                        : syncStatusLabel === 'Sync Failed'
                          ? 'border-rose-500/35 bg-rose-500/10 text-rose-200'
                          : 'border-slate-500/35 bg-slate-800/70 text-slate-300'
                  }`}>
                    {syncStatusLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {canUploadAssets ? (
                    <>
                      <input
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        id={uploadInputId}
                        type="file"
                        onChange={(event) => {
                          void handleLogoUploadChange(chatbot.id, event)
                        }}
                      />
                      <label
                        className="cursor-pointer rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/20"
                        htmlFor={uploadInputId}
                      >
                        {logoUrl ? 'Replace Logo' : 'Upload Logo'}
                      </label>
                      {logoUrl ? (
                        <button
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={logoBusy}
                          type="button"
                          onClick={() => {
                            void handleRemoveLogo(chatbot.id)
                          }}
                        >
                          {logoBusy ? 'Removing...' : 'Remove Logo'}
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                      Upgrade to upload logo
                    </span>
                  )}

                  <button
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={actionBusy}
                    type="button"
                    onClick={() => triggerIngestion(chatbot, 'start')}
                  >
                    {actionBusy ? 'Starting...' : 'Sync Website'}
                  </button>
                  <button
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={actionBusy}
                    type="button"
                    onClick={() => triggerIngestion(chatbot, 'resync')}
                  >
                    {actionBusy ? 'Starting...' : 'Re-sync'}
                  </button>
                  {run && run.status === 'running' ? (
                    <button
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={actionBusy}
                      type="button"
                      onClick={() => cancelIngestion(chatbot.id)}
                    >
                      Cancel Sync
                    </button>
                  ) : null}
                  <button
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                    type="button"
                    onClick={() => loadSnippet(chatbot.id)}
                  >
                    Load Embed Snippet
                  </button>
                </div>

                <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Widget Preview</p>
                  <div className="mt-2 rounded-xl border border-white/10 bg-slate-900/80 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-500/20 text-[11px] font-semibold text-indigo-200">
                        {displayLogoUrl ? (
                          <img alt={`${chatbot.name} widget logo`} className="h-full w-full object-cover" src={displayLogoUrl} />
                        ) : (
                          chatbot.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{chatbot.name}</p>
                        <p className="text-[11px] text-slate-400">Powered by Kufu</p>
                      </div>
                    </div>
                    <div className="mt-2 inline-block max-w-[90%] rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-200">
                      Hi, I&apos;m {chatbot.name}. How can I help you today?
                    </div>
                  </div>
                </div>

                {snippetMap[chatbot.id] ? (
                  <div className="integration-snippet-shell mt-3 rounded-lg border border-white/10 bg-slate-950/80 p-3">
                    <div className="integration-snippet-toolbar">
                      <span className="integration-snippet-label">Embed Snippet</span>
                      <button
                        className="integration-snippet-copy"
                        type="button"
                        title={copiedSnippetByChatbot[chatbot.id] ? 'Copied' : 'Copy snippet'}
                        aria-label={copiedSnippetByChatbot[chatbot.id] ? 'Snippet copied' : 'Copy embed snippet'}
                        onClick={() => copySnippet(chatbot.id, snippetMap[chatbot.id])}
                      >
                        {copiedSnippetByChatbot[chatbot.id] ? (
                          <span className="integration-copy-feedback">Copied</span>
                        ) : null}
                        {copiedSnippetByChatbot[chatbot.id] ? (
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M4.5 10.5L8 14L15.5 6.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <rect x="7" y="3" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                            <rect x="3" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <pre className="integration-snippet overflow-x-auto text-xs text-slate-300">
                      {snippetMap[chatbot.id]}
                    </pre>
                  </div>
                ) : null}
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
