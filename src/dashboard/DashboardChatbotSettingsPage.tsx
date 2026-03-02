import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { BotCustomizationForm } from './components/BotCustomizationForm'
import { ApiError, getChatbotByUser, getChatbotSettings, putChatbotSettings, type ChatbotSettings } from '../lib/api'
import { useAuth } from '../lib/auth-context'

import './DashboardChatbotSettingsPage.css'

export function DashboardChatbotSettingsPage() {
  const { user } = useAuth()
  const [loadingChatbots, setLoadingChatbots] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [settings, setSettings] = useState<ChatbotSettings | null>(null)

  useEffect(() => {
    let active = true

    if (!user?.id) {
      setChatbots([])
      setSelectedChatbotId('')
      setLoadingChatbots(false)
      return
    }

    void (async () => {
      setLoadingChatbots(true)
      setError(null)
      setSuccess(null)
      try {
        const response = await getChatbotByUser(user.id)
        if (!active) {
          return
        }

        const list = response.chatbots.map((chatbot) => ({
          id: chatbot.id,
          name: chatbot.name,
        }))

        setChatbots(list)
        setSelectedChatbotId((current) => {
          if (current && list.some((item) => item.id === current)) {
            return current
          }
          return list[0]?.id ?? ''
        })
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load chatbots.')
      } finally {
        if (active) {
          setLoadingChatbots(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [user?.id])

  useEffect(() => {
    let active = true

    if (!selectedChatbotId) {
      setSettings(null)
      return
    }

    void (async () => {
      setLoadingSettings(true)
      setError(null)
      setSuccess(null)
      try {
        const response = await getChatbotSettings(selectedChatbotId)
        if (!active) {
          return
        }
        setSettings(response.settings)
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load chatbot settings.')
      } finally {
        if (active) {
          setLoadingSettings(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [selectedChatbotId])

  const handleSave = async (payload: {
    bot_name: string
    greeting_message: string
    primary_color: string
  }) => {
    if (!selectedChatbotId) {
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await putChatbotSettings(selectedChatbotId, payload)
      setSettings(response.settings)
      setSuccess('Chatbot settings saved successfully.')
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.message : 'Failed to save chatbot settings.')
    } finally {
      setSaving(false)
    }
  }

  const hasChatbot = chatbots.length > 0

  return (
    <div className="dashboard-chatbot-settings space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Chatbot Settings</h1>
        <p className="text-sm text-slate-400">Customize bot name, greeting, and primary color for each chatbot.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      {loadingChatbots ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">Loading chatbots...</div>
      ) : null}

      {!loadingChatbots && !hasChatbot ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-200">You currently do not have a chatbot. Please create one to access these settings.</p>
          <Link
            className="mt-3 inline-flex rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            to="/dashboard/integrations"
          >
            Create Chatbot
          </Link>
        </div>
      ) : null}

      {hasChatbot ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <label className="block max-w-lg">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Chatbot</span>
              <select
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                disabled={loadingChatbots || chatbots.length === 0}
                value={selectedChatbotId}
                onChange={(event) => setSelectedChatbotId(event.target.value)}
              >
                {chatbots.map((chatbot) => (
                  <option key={chatbot.id} value={chatbot.id}>
                    {chatbot.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <BotCustomizationForm
            initialSettings={settings}
            loading={loadingSettings}
            saving={saving}
            onSubmit={handleSave}
          />
        </>
      ) : null}
    </div>
  )
}