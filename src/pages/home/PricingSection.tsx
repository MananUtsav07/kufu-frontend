import { Reveal } from "./Reveal";

type PricingSectionProps = {
  billingMonthly: boolean;
  onToggleBilling: () => void;
  onScrollTo: (id: string) => void;
};

const plans = [
  {
    title: "Starter",
    description: "Perfect for small businesses and personal websites",
    monthlyPrice: "$X",
    onetimePrice: "$X",
    features: [
      "1 AI chatbot",
      "Website auto-training",
      "500 messages / month",
      "Custom knowledge base",
      "Email support",
    ],
    popular: false,
    dot: "#3b82f6",
    border: "rgba(59,130,246,0.15)",
  },
  {
    title: "Pro",
    description: "For growing businesses that need more power",
    monthlyPrice: "$X",
    onetimePrice: "$X",
    features: [
      "Everything in Starter",
      "3 AI chatbots",
      "2,000 messages / month",
      "Priority re-training",
      "Domain protection",
      "Priority support",
    ],
    popular: true,
    dot: "#6366f1",
    border: "rgba(99,102,241,0.35)",
  },
  {
    title: "Agency",
    description: "For agencies managing multiple client websites",
    monthlyPrice: "$X",
    onetimePrice: "$X",
    features: [
      "Everything in Pro",
      "10 AI chatbots",
      "Unlimited messages",
      "White-label ready",
      "Advanced analytics",
      "Dedicated support",
    ],
    popular: false,
    dot: "#8b5cf6",
    border: "rgba(139,92,246,0.15)",
  },
];

export function PricingSection({ billingMonthly, onToggleBilling, onScrollTo }: PricingSectionProps) {
  return (
    <section id="pricing" className="px-6 md:py-12 py-6 lg:px-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <Reveal className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-indigo-500/25 bg-indigo-500/[0.08] rounded-full px-4 py-1.5 mb-5">
            <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-blue-300 font-mono">Pricing</span>
          </div>
          <h2
            className="font-display font-black text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Simple,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
            Start for free. Upgrade when you're ready. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-full px-5 py-2.5">
            <span className={`text-sm font-semibold transition-colors ${!billingMonthly ? "text-white" : "text-slate-500"}`}>
              One-time
            </span>
            <button
              type="button"
              onClick={onToggleBilling}
              className="relative w-12 h-6 rounded-full border border-white/10 transition-colors duration-300"
              style={{ background: billingMonthly ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "rgba(255,255,255,0.08)" }}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${billingMonthly ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors ${billingMonthly ? "text-white" : "text-slate-500"}`}>
              Monthly
              <span className="ml-2 text-[0.65rem] text-emerald-400 font-bold">Save 20%</span>
            </span>
          </div>
        </Reveal>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <Reveal key={plan.title} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-8 flex flex-col hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{
                  background: plan.popular
                    ? "linear-gradient(145deg, rgba(20,25,60,0.98), rgba(15,20,50,0.95))"
                    : "linear-gradient(145deg, rgba(12,18,35,0.95), rgba(8,12,28,0.9))",
                  border: `1px solid ${plan.border}`,
                  boxShadow: plan.popular
                    ? `0 0 0 1px rgba(99,102,241,0.15), 0 24px 60px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.06)`
                    : `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
                }}
              >
                {/* Popular top bar */}
                {plan.popular && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)" }}
                  />
                )}

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-5 right-5">
                    <span
                      className="text-[0.65rem] font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
                      }}
                    >
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <p
                  className="text-[0.65rem] font-bold tracking-[0.18em] uppercase mb-2 font-mono"
                  style={{ color: plan.dot }}
                >
                  {plan.title}
                </p>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{plan.description}</p>

                {/* Price */}
                <div className="mb-7">
                  <div className="flex items-end gap-1.5 mb-1">
                    <span
                      className="font-display font-black text-white"
                      style={{ fontSize: "2.8rem", letterSpacing: "-0.03em", lineHeight: 1 }}
                    >
                      {billingMonthly ? plan.monthlyPrice : plan.onetimePrice}
                    </span>
                    <span className="text-slate-500 text-sm mb-1.5">
                      {billingMonthly ? "/ month" : " one-time"}
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-slate-600">Pricing coming soon</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-400">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] flex-shrink-0 font-bold"
                        style={{
                          background: `${plan.dot}20`,
                          border: `1px solid ${plan.dot}40`,
                          color: plan.dot,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => onScrollTo("contact")}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                  style={
                    plan.popular
                      ? {
                          background: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                          color: "white",
                          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                        }
                      : {
                          background: "transparent",
                          border: `1px solid ${plan.border}`,
                          color: "#94a3b8",
                        }
                  }
                >
                  Get Started
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom note */}
        <Reveal className="text-center mt-10">
          <p className="text-slate-600 text-sm">
            All plans include a{" "}
            <span className="text-white font-semibold">free trial.</span>
            {" "}No credit card required to start.
          </p>
        </Reveal>
      </div>
    </section>
  );
}