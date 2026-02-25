import { Reveal } from "./Reveal";

export function CtaSection() {
  return (
    <section id="contact" className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] p-12 text-center grad-bg shadow-[0_24px_80px_rgba(99,102,241,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-white/70 mb-4">Free Trial</p>
              <h2 className="font-display font-black text-white mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.03em" }}>
                Start Your 7-Day Free<br />AI Pilot
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                Validate impact with your real customer conversations before any long-term commitment.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button type="button" className="bg-white text-indigo-600 font-black text-sm px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-xl transition-all">
                  Request a Free Demo
                </button>
                <button type="button" className="bg-white/10 border border-white/30 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-white/20 transition-all">
                  Speak to Sales
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
