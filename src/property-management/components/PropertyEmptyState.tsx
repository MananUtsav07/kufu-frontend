type PropertyEmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function PropertyEmptyState({ title, description, actionLabel, onAction }: PropertyEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-6 text-center">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <button
          className="mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 py-1.5 text-sm font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/25"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
