import { type FormEvent, useEffect, useState } from 'react'

import {
  ApiError,
  deleteDashboardChatbot,
  getDashboardChatbots,
  getDashboardEmbed,
  getRagIngestStatus,
  patchDashboardChatbot,
  postDashboardChatbot,
  postRagIngestCancel,
  postRagIngestResync,
  postRagIngestStart,
  type DashboardChatbot,
  type RagIngestionRun,
} from '../lib/api'
import './DashboardIntegrationsPage.css'

export function DashboardIntegrationsPage() {
  const [chatbots, setChatbots] = useState<DashboardChatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [snippetMap, setSnippetMap] = useState<Record<string, string>>({})
  const [ragRunByChatbot, setRagRunByChatbot] = useState<Record<string, string>>({})
  const [ragStatusByRun, setRagStatusByRun] = useState<Record<string, RagIngestionRun>>({})
  const [ragActionBusy, setRagActionBusy] = useState<Record<string, boolean>>({})
  const [ragMaxPages, setRagMaxPages] = useState(60)
  const [ragUrlsText, setRagUrlsText] = useState('')

  const loadChatbots = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getDashboardChatbots()
      setChatbots(response.chatbots)
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load chatbots.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadChatbots()
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

  const toggleActive = async (chatbot: DashboardChatbot) => {
    setError(null)
    try {
      const response = await patchDashboardChatbot(chatbot.id, {
        is_active: !chatbot.is_active,
      })

      setChatbots((current) =>
        current.map((item) => (item.id === chatbot.id ? response.chatbot : item)),
      )
    } catch (updateError) {
      setError(updateError instanceof ApiError ? updateError.message : 'Failed to update chatbot.')
    }
  }

  const removeChatbot = async (chatbotId: string) => {
    setError(null)
    try {
      await deleteDashboardChatbot(chatbotId)
      setChatbots((current) => current.filter((item) => item.id !== chatbotId))
    } catch (deleteError) {
      setError(deleteError instanceof ApiError ? deleteError.message : 'Failed to delete chatbot.')
    }
  }

  const loadSnippet = async (chatbotId: string) => {
    setError(null)
    try {
      const response = await getDashboardEmbed(chatbotId)
      setSnippetMap((current) => ({ ...current, [chatbotId]: response.snippet }))
    } catch (snippetError) {
      setError(snippetError instanceof ApiError ? snippetError.message : 'Failed to load embed snippet.')
    }
  }

  const copySnippet = async (snippet: string) => {
    await navigator.clipboard.writeText(snippet)
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
        maxPages: ragMaxPages,
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
    } catch (ingestError) {
      setError(ingestError instanceof ApiError ? ingestError.message : 'Failed to start website sync.')
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
    } catch (cancelError) {
      setError(cancelError instanceof ApiError ? cancelError.message : 'Failed to cancel sync.')
    } finally {
      setRagActionBusy((current) => ({ ...current, [chatbotId]: false }))
    }
  }

  return (
    <div className="dashboard-integrations space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Integrations</h1>
        <p className="text-sm text-slate-400">Create chatbots and copy installation snippets for websites.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

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
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <label htmlFor="rag-max-pages">Sync max pages</label>
          <input
            className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-slate-200"
            id="rag-max-pages"
            max={200}
            min={1}
            type="number"
            value={ragMaxPages}
            onChange={(event) => setRagMaxPages(Number(event.target.value || 60))}
          />
        </div>
        <div className="mt-3 space-y-2">
          <label className="text-xs text-slate-400" htmlFor="rag-urls-input">
            Optional URLs to ingest directly (one per line, public pages only)
          </label>
          <textarea
            className="min-h-[90px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200"
            id="rag-urls-input"
            placeholder={'https://example.com/about\nhttps://example.com/services'}
            value={ragUrlsText}
            onChange={(event) => setRagUrlsText(event.target.value)}
          />
          <p className="text-[11px] text-slate-500">
            For private/dashboard pages that require login, add content in Knowledge Base instead.
          </p>
        </div>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading integrations...</p>
        ) : chatbots.length === 0 ? (
          <p className="text-sm text-slate-400">No integrations configured yet.</p>
        ) : (
          chatbots.map((chatbot) => {
            const runId = ragRunByChatbot[chatbot.id]
            const run = runId ? ragStatusByRun[runId] : null
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
                  <div>
                    <h3 className="text-base font-semibold text-white">{chatbot.name}</h3>
                    <p className="text-xs text-slate-400">{chatbot.website_url || 'No website URL configured'}</p>
                    <p className="mt-1 text-xs text-slate-500">Public key: {chatbot.widget_public_key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                      type="button"
                      onClick={() => toggleActive(chatbot)}
                    >
                      {chatbot.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                      type="button"
                      onClick={() => removeChatbot(chatbot.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={Boolean(ragActionBusy[chatbot.id])}
                    type="button"
                    onClick={() => triggerIngestion(chatbot, 'start')}
                  >
                    Sync Website
                  </button>
                  <button
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={Boolean(ragActionBusy[chatbot.id])}
                    type="button"
                    onClick={() => triggerIngestion(chatbot, 'resync')}
                  >
                    Re-sync
                  </button>
                  {run && run.status === 'running' ? (
                    <button
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={Boolean(ragActionBusy[chatbot.id])}
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
                  {snippetMap[chatbot.id] ? (
                    <button
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                      type="button"
                      onClick={() => copySnippet(snippetMap[chatbot.id])}
                    >
                      Copy Snippet
                    </button>
                  ) : null}
                </div>

                {snippetMap[chatbot.id] ? (
                  <pre className="integration-snippet mt-3 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/80 p-3 text-xs text-slate-300">
                    {snippetMap[chatbot.id]}
                  </pre>
                ) : null}
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
