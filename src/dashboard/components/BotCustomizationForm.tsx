import { type FormEvent, useState } from 'react'

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
const DEFAULT_PRIMARY_COLOR = '#6366f1'

function normalizeHexColor(value: string | null | undefined): string {
  if (!value) {
    return DEFAULT_PRIMARY_COLOR
  }

  const trimmed = value.trim()
  return HEX_COLOR_PATTERN.test(trimmed) ? trimmed : DEFAULT_PRIMARY_COLOR
}

export function BotCustomizationForm({
  initialSettings,
  loading = false,
  saving = false,
  onSubmit,
}: BotCustomizationFormProps) {
  const initialBotName = initialSettings?.bot_name ?? ''
  const initialGreetingMessage = initialSettings?.greeting_message ?? ''
  const initialPrimaryColor = normalizeHexColor(initialSettings?.primary_color)

  const [botName, setBotName] = useState(initialBotName)
  const [greetingMessage, setGreetingMessage] = useState(initialGreetingMessage)
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedBotName = botName.trim()
    const normalizedGreeting = greetingMessage.trim()
    const normalizedColor = normalizeHexColor(primaryColor)

    if (!normalizedBotName) {
      setFormError('Bot name is required.')
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
          placeholder="Leave empty to auto-generate: Hi, welcome to [Bot Name]. How can we help you today?"
          value={greetingMessage}
          onChange={(event) => setGreetingMessage(event.target.value)}
        />
        <p className="mt-1 text-[11px] text-slate-500">Leave blank to use the default greeting with your bot name.</p>
      </label>

      <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Primary Color</span>
          <input
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-2 py-1.5"
            disabled={loading || saving || !initialSettings}
            type="color"
            value={primaryColor}
            onChange={(event) => setPrimaryColor(event.target.value)}
          />
        </label>

        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Preview</p>
          <p className="text-sm text-slate-200">Selected color: {primaryColor.toUpperCase()}</p>
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
