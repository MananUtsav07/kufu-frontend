import { steps } from "./HomeData";
import { Reveal } from "./Reveal";

export function StepsSection() {
  return (
    <section id="case-studies" className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">How It Works</p>
          <h2 className="font-display font-black text-white mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.02em" }}>Implementation in 3 Clear Steps</h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">Designed for fast deployment with low operational overhead.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <span className="absolute top-4 right-5 font-display font-black text-5xl text-indigo-500/[0.12] select-none">{s.id}</span>
                <div className="text-3xl mb-4">{s.icon}</div>
                <p className="text-[0.7rem] font-bold tracking-widest uppercase text-indigo-400 mb-2">Step {s.id}</p>
                <h3 className="font-display font-bold text-lg text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
