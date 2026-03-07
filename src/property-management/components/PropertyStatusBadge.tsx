const STATUS_COLOR_CLASSES: Record<string, string> = {
  open: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  in_progress: 'border-sky-500/30 bg-sky-500/15 text-sky-200',
  resolved: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  closed: 'border-slate-500/30 bg-slate-500/15 text-slate-200',
  pending: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  paid: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  overdue: 'border-rose-500/30 bg-rose-500/15 text-rose-200',
  partial: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-200',
}

type PropertyStatusBadgeProps = {
  value: string
}

export function PropertyStatusBadge({ value }: PropertyStatusBadgeProps) {
  const normalized = value.toLowerCase()
  const className = STATUS_COLOR_CLASSES[normalized] ?? 'border-white/20 bg-white/5 text-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      {normalized.replace(/_/g, ' ')}
    </span>
  )
}
