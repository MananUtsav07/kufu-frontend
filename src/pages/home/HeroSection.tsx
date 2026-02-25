import { trustChannels } from "./HomeData";
import { BotIcon } from "./BotIcon";

type HeroSectionProps = {
  onScrollTo: (id: string) => void;
};

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-white/[0.06] pb-20 pt-24 lg:pb-28 lg:pt-32 px-6 lg:px-10">
      <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.16] blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-violet-600/[0.12] blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_60%_0%,rgba(99,102,241,0.12),transparent)]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="hero-enter [animation-delay:0.1s] inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
            <span className="text-[0.68rem] font-bold tracking-[0.15em] uppercase text-indigo-300">AI Conversation Automation</span>
          </div>

          <h1 className="hero-enter [animation-delay:0.22s] font-display font-black tracking-tight text-white mb-6" style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Professional AI<br />support that<br /><span className="grad-text">captures more leads</span>,<br />around the clock.
          </h1>

          <p className="hero-enter [animation-delay:0.34s] text-base lg:text-lg leading-relaxed text-slate-400 max-w-[480px] mb-8">
            Kufu automates customer conversations across website, WhatsApp, and Instagram with fast responses, intelligent routing, and clear conversion tracking.
          </p>

          <div className="hero-enter [animation-delay:0.44s] flex flex-wrap gap-3 mb-10">
            <button type="button" onClick={() => onScrollTo("contact")} className="inline-flex items-center gap-2 grad-bg text-white font-bold text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Request a Free Demo
            </button>
            <button type="button" onClick={() => onScrollTo("pricing")} className="font-semibold text-sm px-6 py-3 rounded-full border border-white/10 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all">
              View Pricing ↓
            </button>
          </div>

          <div className="hero-enter [animation-delay:0.54s] grid grid-cols-3 gap-3">
            {([["24/7", "Always Available"], ["< 5s", "Typical Response"], ["Multi-ch.", "One Unified Flow"]] as [string, string][]).map(([val, label]) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                <p className="font-display font-black text-white text-xl mb-0.5">{val}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="float-anim">
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.15)]">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.07]">
              <div className="w-9 h-9 rounded-xl grad-bg flex items-center justify-center flex-shrink-0"><BotIcon size={18} /></div>
              <div>
                <p className="text-sm font-bold text-slate-100">Kufu Assistant</p>
                <p className="text-[0.7rem] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online
                </p>
              </div>
              <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-widest text-slate-500">Live Preview</span>
            </div>

            <div className="flex flex-col gap-2.5 mb-5">
              <div className="self-start max-w-[80%] rounded-[18px_18px_18px_4px] bg-indigo-500/[0.15] border border-indigo-500/20 px-4 py-2.5 text-sm text-slate-200 leading-relaxed">
                👋 Hi! I&apos;m Kufu. How can I help you today?
              </div>
              <div className="self-end max-w-[80%] rounded-[18px_18px_4px_18px] bg-white/[0.05] border border-white/[0.08] px-4 py-2.5 text-sm text-slate-300 leading-relaxed">
                I&apos;d like to learn more about pricing
              </div>
              <div className="self-start max-w-[80%] rounded-[18px_18px_18px_4px] bg-indigo-500/[0.15] border border-indigo-500/20 px-4 py-2.5 text-sm text-slate-200 leading-relaxed">
                Great! We have 3 plans starting from ₹3,999. Want to book a free demo?
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 dot-blink" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 dot-blink-2" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 dot-blink-3" />
                <span className="text-[0.7rem] text-slate-500 ml-1">Kufu is typing…</span>
              </div>
            </div>

            <div className="border-t border-white/[0.07] pt-4">
              <p className="text-[0.65rem] uppercase tracking-widest text-slate-500 mb-2.5">Trusted Channels</p>
              <div className="flex flex-wrap gap-1.5">
                {trustChannels.map((c) => (
                  <span key={c} className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">{c}</span>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl px-3.5 py-2 shadow-[0_4px_16px_rgba(34,197,94,0.3)]">
              <p className="text-xs font-bold text-white">⚡ Response in 2s</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
