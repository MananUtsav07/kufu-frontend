import { pricingPlans } from "./HomeData";
import { Reveal } from "./Reveal";

type PricingSectionProps = {
  billingMonthly: boolean;
  onToggleBilling: () => void;
  onScrollTo: (id: string) => void;
};

export function PricingSection({ billingMonthly, onToggleBilling, onScrollTo }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">Pricing</p>
          <h2 className="font-display font-black text-white mb-2" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.02em" }}>Transparent Pricing</h2>
          <p className="text-slate-400 mb-8">Start with a 7-day pilot. Pay setup only after pilot success.</p>
          <div className="inline-flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-full px-5 py-2.5">
            <span className={`text-sm font-semibold transition-colors ${!billingMonthly ? "text-indigo-300" : "text-slate-500"}`}>One-time setup</span>
            <button type="button" onClick={onToggleBilling} className={`relative w-12 h-6 rounded-full border border-white/10 transition-colors duration-300 ${billingMonthly ? "bg-indigo-500" : "bg-slate-700"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${billingMonthly ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <span className={`text-sm font-semibold transition-colors ${billingMonthly ? "text-indigo-300" : "text-slate-500"}`}>Monthly</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.title} delay={i * 0.1}>
              <div className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${plan.popular ? "border-indigo-500/50 bg-indigo-500/[0.07]" : "border-white/[0.08] bg-white/[0.02]"}`}>
                {plan.popular ? <div className="absolute top-0 left-0 right-0 h-0.5 grad-bg" /> : null}
                <div className="flex items-start justify-between mb-1">
                  <p className="font-display font-extrabold text-lg text-white">{plan.title}</p>
                  {plan.popular ? <span className="text-[0.65rem] font-bold tracking-wider uppercase badge-shimmer text-white px-2.5 py-1 rounded-full">Popular</span> : null}
                </div>
                <p className="text-sm text-slate-500 mb-5">{plan.description}</p>
                <div className="mb-6">
                  <span className="font-display font-black text-3xl text-white">{billingMonthly ? plan.monthlyPrice : plan.onetimePrice}</span>
                  <span className="text-slate-500 text-sm ml-1">{billingMonthly ? "/mo" : " one-time"}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[0.6rem] flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => onScrollTo("contact")} className={`w-full py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${plan.popular ? "grad-bg text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)]" : "border border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300"}`}>
                  Get Started
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
