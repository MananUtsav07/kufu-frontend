import { outcomes } from "./HomeData";
import { Reveal } from "./Reveal";

export function OutcomesSection() {
  return (
    <section id="services" className="py-24 px-6 lg:px-10 bg-gradient-to-b from-indigo-950/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-14">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">Why Kufu</p>
          <h2 className="font-display font-black text-white mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.02em" }}>Business Outcomes</h2>
          <p className="text-slate-400 max-w-md leading-relaxed">Everything is built to improve response quality and conversion efficiency.</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-indigo-500/30 hover:bg-indigo-500/[0.05] hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-5">{o.icon}</div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{o.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{o.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
