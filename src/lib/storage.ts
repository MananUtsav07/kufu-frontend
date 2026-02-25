export const STORAGE_KEYS = {
  chat: 'autolead_chat_v1',
  chatSession: 'autolead_chat_session_v1',
  demoLeads: 'autolead_leads_demo',
  contactLeads: 'autolead_leads_contact',
} as const

const hasWindow = () => typeof window !== 'undefined'

export function readStorageList<T>(key: string): T[] {
  if (!hasWindow()) {
    return []
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export function writeStorageList<T>(key: string, values: T[]): void {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(values))
}

export function appendStorageItem<T>(key: string, value: T): void {
  const next = [...readStorageList<T>(key), value]
  writeStorageList(key, next)
}

export function getTimestamp(): number {
  return Date.now()
}

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${getTimestamp()}-${Math.random().toString(16).slice(2)}`
}

export function getOrCreateStorageSession(key: string): string {
  if (!hasWindow()) {
    return 'server-session'
  }

  const existing = window.localStorage.getItem(key)
  if (existing) {
    return existing
  }

  const created = createSessionId()
  window.localStorage.setItem(key, created)
  return created
}
