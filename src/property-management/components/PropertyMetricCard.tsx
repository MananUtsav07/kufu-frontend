type PropertyMetricCardProps = {
  label: string
  value: string | number
  hint?: string
}

export function PropertyMetricCard({ label, value, hint }: PropertyMetricCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </article>
  )
}
