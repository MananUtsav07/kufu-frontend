import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { scrollToId } from "../lib/scrollToId";
import { useScrollFromLocationState } from "../lib/useScrollFromLocationState";
import { CtaSection } from "./home/CtaSection";
import { FaqSection } from "./home/FaqSection";
import { FloatingChat } from "./home/FloatingChat";
import { FooterSection } from "./home/FooterSection";
import { HeroSection } from "./home/HeroSection";
import { HomeStyles } from "./home/HomeStyles";
import { OutcomesSection } from "./home/OutcomesSection";
import { PricingSection } from "./home/PricingSection";
import { StepsSection } from "./home/StepsSection";

export function HomePage() {
  const [billingMonthly, setBillingMonthly] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  useScrollFromLocationState();

  const scrollTo = (id: string): void => {
    scrollToId(id);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 antialiased overflow-x-hidden">
      <HomeStyles />
      <Navbar page="home" />

      <HeroSection onScrollTo={scrollTo} />
      <StepsSection />
      <OutcomesSection />
      <PricingSection
        billingMonthly={billingMonthly}
        onToggleBilling={() => setBillingMonthly((v) => !v)}
        onScrollTo={scrollTo}
      />
      <FaqSection />
      <CtaSection />
      <FooterSection />

      <FloatingChat chatOpen={chatOpen} onToggle={() => setChatOpen((v) => !v)} />
    </div>
  );
}
