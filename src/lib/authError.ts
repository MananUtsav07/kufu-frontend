export function getReadableAuthError(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof Error)) {
    return fallbackMessage
  }

  const message = error.message?.trim()
  if (!message) {
    return fallbackMessage
  }

  if (message === 'Failed to fetch') {
    return 'Network/CORS issue reaching Supabase. Check Vercel Supabase env vars, Supabase URL config, and disable strict browser shields/ad blockers for this site.'
  }

  return message
}

