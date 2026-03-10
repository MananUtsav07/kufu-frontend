import type { DetectionConfidence, WebsiteType } from '../../lib/api'
import './DetectionResultBadge.css'

type DetectionResultBadgeProps = {
  websiteType: WebsiteType
  confidence: DetectionConfidence
  signals: string[]
}

function formatWebsiteType(websiteType: WebsiteType): string {
  switch (websiteType) {
    case 'nextjs':
      return 'Next.js'
    case 'wordpress':
      return 'WordPress'
    case 'webflow':
      return 'Webflow'
    case 'shopify':
      return 'Shopify'
    case 'squarespace':
      return 'Squarespace'
    case 'wix':
      return 'Wix'
    case 'react':
      return 'React'
    case 'custom':
      return 'Custom'
    default:
      return 'Unknown'
  }
}

function confidenceClass(confidence: DetectionConfidence): string {
  if (confidence === 'high') {
    return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
  }
  if (confidence === 'medium') {
    return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
  }
  return 'border-slate-500/35 bg-slate-500/10 text-slate-300'
}

export function DetectionResultBadge(props: DetectionResultBadgeProps) {
  return (
    <div className="detection-result-badge rounded-xl border border-white/10 bg-slate-950/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-indigo-500/35 bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold text-indigo-200">
          Detected: {formatWebsiteType(props.websiteType)}
        </span>
        <span
          className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${confidenceClass(props.confidence)}`}
        >
          Confidence: {props.confidence}
        </span>
      </div>
      {props.signals.length > 0 ? (
        <p className="mt-2 text-[11px] text-slate-400">
          Signals: {props.signals.slice(0, 5).join(', ')}
        </p>
      ) : (
        <p className="mt-2 text-[11px] text-slate-500">No strong platform signals found.</p>
      )}
    </div>
  )
}
