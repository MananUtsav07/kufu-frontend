import { type FormEvent, useEffect, useState } from 'react'

import {
  ApiError,
  deleteDashboardChatbot,
  getDashboardChatbots,
  getDashboardEmbed,
  patchDashboardChatbot,
  postDashboardChatbot,
  type DashboardChatbot,
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
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading integrations...</p>
        ) : chatbots.length === 0 ? (
          <p className="text-sm text-slate-400">No integrations configured yet.</p>
        ) : (
          chatbots.map((chatbot) => (
            <article key={chatbot.id} className="integration-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
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
          ))
        )}
      </div>
    </div>
  )
}
