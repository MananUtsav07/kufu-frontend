export function getReadableAuthError(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof Error)) {
    return fallbackMessage
  }

  const message = error.message?.trim()
  if (!message) {
    return fallbackMessage
  }

  if (message === 'Failed to fetch') {
    return 'Network/CORS issue reaching backend auth API. Check API URL/proxy and CORS configuration.'
  }

  return message
}
