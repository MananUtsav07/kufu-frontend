export function getReadableAuthError(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof Error)) {
    return fallbackMessage
  }

  const message = error.message?.trim()
  if (!message) {
    return fallbackMessage
  }

  if (message === 'Failed to fetch') {
    return 'Unable to reach the server. Please check your connection and try again.'
  }

  return message
}
