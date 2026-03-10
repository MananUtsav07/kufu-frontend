import { useEffect, useMemo, useState } from 'react'

import {
  ApiError,
  getSiteDetectionInstallGuide,
  postSiteDetectionDetect,
  type InstallGuidePayload,
  type SiteDetectionResult,
  type WebsiteType,
} from '../../lib/api'
import { DetectionResultBadge } from './DetectionResultBadge'
import { InstallGuideCard } from './InstallGuideCard'
import './WebsiteTypeDetector.css'

type WebsiteTypeDetectorProps = {
  chatbotId: string
  chatbotName: string
  websiteUrl: string | null
}

function websiteTypeDescription(type: WebsiteType): string {
  switch (type) {
    case 'wordpress':
      return 'Looks like a WordPress site. Use theme/footer script injection or a header/footer plugin.'
    case 'shopify':
      return 'Looks like Shopify. Add the script in theme.liquid before closing body.'
    case 'react':
      return 'Looks like a React SPA. Add script in index.html before closing body.'
    case 'nextjs':
      return 'Looks like Next.js. Add script in your root layout or custom document.'
    case 'webflow':
      return 'Looks like Webflow. Use Project Settings > Custom Code.'
    case 'wix':
      return 'Looks like Wix. Use Settings > Custom Code injection.'
    case 'squarespace':
      return 'Looks like Squarespace. Use Settings > Advanced > Code Injection.'
    case 'custom':
      return 'No specific CMS markers found. Use the universal Kufu embed script.'
    default:
      return 'Could not reliably detect platform. Use the universal Kufu embed script.'
  }
}

export function WebsiteTypeDetector(props: WebsiteTypeDetectorProps) {
  const [inputUrl, setInputUrl] = useState(props.websiteUrl ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState<SiteDetectionResult | null>(null)
  const [installGuide, setInstallGuide] = useState<InstallGuidePayload | null>(null)

  useEffect(() => {
    setInputUrl(props.websiteUrl ?? '')
  }, [props.websiteUrl])

  const hasUrl = useMemo(() => inputUrl.trim().length > 0, [inputUrl])

  const detectWebsite = async () => {
    if (!hasUrl) {
      setError('Add a website URL first to run detection.')
      return
    }

    setBusy(true)
    setCopied(false)
    setError(null)

    try {
      const detectionResponse = await postSiteDetectionDetect({
        chatbotId: props.chatbotId,
        websiteUrl: inputUrl.trim(),
      })

      const guideResponse = await getSiteDetectionInstallGuide({
        websiteType: detectionResponse.websiteType,
        chatbotId: props.chatbotId,
      })

      setResult({
        websiteType: detectionResponse.websiteType,
        confidence: detectionResponse.confidence,
        signals: detectionResponse.signals,
      })
      setInstallGuide({
        title: guideResponse.title,
        steps: guideResponse.steps,
        scriptExample: guideResponse.scriptExample,
      })
    } catch (detectError) {
      setError(
        detectError instanceof ApiError
          ? detectError.message
          : 'Detection failed. Please verify the website URL and try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  const copyScript = async () => {
    if (!installGuide?.scriptExample) {
      return
    }

    try {
      await navigator.clipboard.writeText(installGuide.scriptExample)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setError('Could not copy script. Copy it manually from the snippet.')
    }
  }

  return (
    <div className="website-type-detector mt-3 rounded-xl border border-white/10 bg-slate-900/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Website Type Detection</p>
          <p className="text-[11px] text-slate-500">
            Detect platform and get tailored installation guidance for {props.chatbotName}.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          className="min-w-[240px] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100"
          placeholder="https://example.com"
          type="url"
          value={inputUrl}
          onChange={(event) => setInputUrl(event.target.value)}
        />
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={busy || !hasUrl}
          type="button"
          onClick={() => {
            void detectWebsite()
          }}
        >
          {busy ? 'Detecting...' : result ? 'Re-detect' : 'Detect Website'}
        </button>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-3 space-y-3">
          <DetectionResultBadge
            confidence={result.confidence}
            signals={result.signals}
            websiteType={result.websiteType}
          />
          <p className="text-xs text-slate-300">{websiteTypeDescription(result.websiteType)}</p>
          {installGuide ? (
            <InstallGuideCard
              copied={copied}
              scriptExample={installGuide.scriptExample}
              steps={installGuide.steps}
              title={installGuide.title}
              onCopyScript={copyScript}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
