import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type RequireChatbotProps = {
  hasChatbot: boolean
  children: ReactNode
  message?: string
  actionTo?: string
  actionLabel?: string
}

const DEFAULT_MESSAGE = 'You currently do not have a chatbot. Please create one to access these settings.'

export function RequireChatbot({
  hasChatbot,
  children,
  message = DEFAULT_MESSAGE,
  actionTo = '/dashboard/integrations',
  actionLabel = 'Create Chatbot',
}: RequireChatbotProps) {
  if (hasChatbot) {
    return <>{children}</>
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
      <p className="text-sm text-amber-200">{message}</p>
      <Link
        className="mt-3 inline-flex rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        to={actionTo}
      >
        {actionLabel}
      </Link>
    </div>
  )
}
