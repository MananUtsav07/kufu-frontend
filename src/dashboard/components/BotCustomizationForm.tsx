import { type FormEvent, useEffect, useState } from 'react'

import type { ChatbotSettings } from '../../lib/api'

import './BotCustomizationForm.css'

type BotCustomizationFormProps = {
  initialSettings: ChatbotSettings | null
  loading?: boolean
  saving?: boolean
  onSubmit: (payload: {
    bot_name: string
    greeting_message: string
    primary_color: string
  }) => Promise<void>
}

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

export function BotCustomizationForm({
  initialSettings,
  loading = false,
  saving = false,
  onSubmit,
}: BotCustomizationFormProps) {
  const [botName, setBotName] = useState('')
  const [greetingMessage, setGreetingMessage] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialSettings) {
      setBotName('')
      setGreetingMessage('')
      setPrimaryColor('#6366f1')
      setFormError(null)
      return
    }

    setBotName(initialSettings.bot_name)
    setGreetingMessage(initialSettings.greeting_message)
    setPrimaryColor(initialSettings.primary_color)
    setFormError(null)
  }, [initialSettings])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedBotName = botName.trim()
    const normalizedGreeting = greetingMessage.trim()
    const normalizedColor = primaryColor.trim()

    if (!normalizedBotName) {
      setFormError('Bot name is required.')
      return
    }

    if (!normalizedGreeting) {
      setFormError('Greeting message is required.')
      return
    }

    if (!HEX_COLOR_PATTERN.test(normalizedColor)) {
      setFormError('Primary color must be a valid hex value like #4f46e5.')
      return
    }

    setFormError(null)
    await onSubmit({
      bot_name: normalizedBotName,
      greeting_message: normalizedGreeting,
      primary_color: normalizedColor,
    })
  }

  return (
    <form className="bot-customization-form space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Chatbot Name</span>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          disabled={loading || saving || !initialSettings}
          placeholder="Kufu Assistant"
          type="text"
          value={botName}
          onChange={(event) => setBotName(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Greeting Message</span>
        <textarea
          className="min-h-[110px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          disabled={loading || saving || !initialSettings}
          placeholder="Hi there. How can I help your business today?"
          value={greetingMessage}
          onChange={(event) => setGreetingMessage(event.target.value)}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Primary Color</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            disabled={loading || saving || !initialSettings}
            placeholder="#6366f1"
            type="text"
            value={primaryColor}
            onChange={(event) => setPrimaryColor(event.target.value)}
          />
        </label>

        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Preview</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 rounded-full border border-white/30" style={{ backgroundColor: primaryColor }} />
            <span className="text-sm text-slate-200">Header and action accents</span>
          </div>
        </div>
      </div>

      {formError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{formError}</div>
      ) : null}

      <div className="flex justify-end">
        <button
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading || saving || !initialSettings}
          type="submit"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}