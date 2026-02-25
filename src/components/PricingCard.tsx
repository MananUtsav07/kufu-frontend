import { Link } from 'react-router-dom'

import { GlassPanel } from './GlassPanel'

type PricingCardProps = {
  title: string
  description: string
  oneTimePrice: number
  monthlyPrice: number
  features: string[]
  isPopular?: boolean
  billingMode: 'oneTime' | 'monthly'
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const formatPrice = (value: number) => inrFormatter.format(value)

export function PricingCard({
  title,
  description,
  oneTimePrice,
  monthlyPrice,
  features,
  isPopular = false,
  billingMode,
}: PricingCardProps) {
  const price = billingMode === 'monthly' ? monthlyPrice : oneTimePrice

  return (
    <GlassPanel className={`flex flex-col rounded-2xl p-8 ${isPopular ? 'relative border-primary' : 'border-slate-800'}`}>
      {isPopular ? (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-widest">
          Most Popular
        </div>
      ) : null}

      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="mb-6 text-sm text-slate-400">{description}</p>
      <div className="mb-6 flex min-h-[3rem] items-end gap-1">
        <span className="inline-block min-w-[8ch] text-4xl font-bold tabular-nums">{formatPrice(price)}</span>
        <span
          className={`inline-block w-[3ch] text-slate-400 ${
            billingMode === 'monthly' ? '' : 'invisible'
          }`}
        >
          /mo
        </span>
      </div>

      <ul className="mb-8 flex-grow space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        className={`w-full rounded-xl py-3 text-center font-bold transition-all ${
          isPopular
            ? 'bg-primary shadow-[0_0_15px_rgba(19,37,236,0.3)] hover:bg-primary/90'
            : 'bg-slate-800 hover:bg-slate-700'
        }`}
        to="/demo"
      >
        Get Started
      </Link>
    </GlassPanel>
  )
}
