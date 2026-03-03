export type DashboardSetupProgress = {
  syncedWebsite: boolean
  loadedSnippet: boolean
  testedAssistant: boolean
}

const DEFAULT_PROGRESS: DashboardSetupProgress = {
  syncedWebsite: false,
  loadedSnippet: false,
  testedAssistant: false,
}

const STORAGE_KEY_PREFIX = 'kufu_dashboard_setup_progress_v1'

function canUseStorage() {
  return typeof window !== 'undefined'
}

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`
}

export function readDashboardSetupProgress(userId: string | undefined): DashboardSetupProgress {
  if (!userId || !canUseStorage()) {
    return DEFAULT_PROGRESS
  }

  const raw = window.localStorage.getItem(getStorageKey(userId))
  if (!raw) {
    return DEFAULT_PROGRESS
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DashboardSetupProgress>
    return {
      syncedWebsite: Boolean(parsed.syncedWebsite),
      loadedSnippet: Boolean(parsed.loadedSnippet),
      testedAssistant: Boolean(parsed.testedAssistant),
    }
  } catch {
    return DEFAULT_PROGRESS
  }
}

export function markDashboardSetupProgress(
  userId: string | undefined,
  next: Partial<DashboardSetupProgress>,
) {
  if (!userId || !canUseStorage()) {
    return
  }

  const current = readDashboardSetupProgress(userId)
  const merged: DashboardSetupProgress = {
    syncedWebsite: current.syncedWebsite || Boolean(next.syncedWebsite),
    loadedSnippet: current.loadedSnippet || Boolean(next.loadedSnippet),
    testedAssistant: current.testedAssistant || Boolean(next.testedAssistant),
  }

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(merged))
}
