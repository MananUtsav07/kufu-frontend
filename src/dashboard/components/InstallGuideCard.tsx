import './InstallGuideCard.css'

type InstallGuideCardProps = {
  title: string
  steps: string[]
  scriptExample: string
  copied: boolean
  onCopyScript: () => Promise<void> | void
}

export function InstallGuideCard(props: InstallGuideCardProps) {
  return (
    <div className="install-guide-card rounded-xl border border-white/10 bg-slate-950/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-white">{props.title}</h4>
        <button
          className="rounded-lg border border-indigo-500/35 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/20"
          type="button"
          onClick={() => {
            void props.onCopyScript()
          }}
        >
          {props.copied ? 'Copied' : 'Copy Script'}
        </button>
      </div>

      <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-slate-300">
        {props.steps.map((step, index) => (
          <li key={`${step}-${index}`}>{step}</li>
        ))}
      </ol>

      <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/90 p-2 text-[11px] text-slate-300">
        {props.scriptExample}
      </pre>
    </div>
  )
}
