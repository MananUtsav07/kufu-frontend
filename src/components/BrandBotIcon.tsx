import { brandChatLogoSrc } from '../lib/brand'

type BrandBotIconProps = {
  size?: number
  className?: string
}

export function BrandBotIcon({ size = 18, className = '' }: BrandBotIconProps) {
  const style = { width: size, height: size }

  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center overflow-hidden ${className}`.trim()}
      style={style}
    >
      {brandChatLogoSrc ? (
        <img alt="" className="h-full w-full object-contain" src={brandChatLogoSrc} />
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="13" rx="3" fill="white" fillOpacity="0.9" />
          <circle cx="9" cy="14" r="1.5" fill="#6366f1" />
          <circle cx="15" cy="14" r="1.5" fill="#6366f1" />
          <path d="M9 18h6" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 8V5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="4" r="1.5" fill="white" fillOpacity="0.7" />
        </svg>
      )}
    </span>
  )
}
