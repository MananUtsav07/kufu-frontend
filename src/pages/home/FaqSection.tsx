import { faqs } from "./HomeData";
import { FAQItem } from "./FAQItem";
import { Reveal } from "./Reveal";

export function FaqSection() {
  return (
    <section id="faq" className="py-24 px-6 lg:px-10 bg-gradient-to-b from-indigo-950/20 to-transparent">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">FAQ</p>
          <h2 className="font-display font-black text-white" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.02em" }}>
            Frequently Asked Questions
          </h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.question} delay={i * 0.07}>
              <FAQItem question={f.question} answer={f.answer} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
