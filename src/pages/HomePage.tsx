import { useState, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// ── Types ──────────────────────────────────────────────────────────────────
interface Outcome {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface PricingPlan {
  title: string;
  description: string;
  monthlyPrice: string;
  onetimePrice: string;
  features: string[];
  popular: boolean;
}

interface Faq {
  question: string;
  answer: string;
}

interface BotIconProps {
  size?: number;
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

// ── Data ───────────────────────────────────────────────────────────────────
const trustChannels: string[] = ["Website", "WhatsApp", "Instagram", "Slack", "HubSpot", "Salesforce"];

const outcomes: Outcome[] = [
  { icon: "⚡", title: "Faster First Response", description: "Respond to every inquiry instantly, even outside business hours." },
  { icon: "👥", title: "Higher Lead Conversion", description: "Capture intent and route qualified leads to your sales flow automatically." },
  { icon: "📅", title: "Automated Scheduling", description: "Book meetings directly into calendar with business-rule checks." },
  { icon: "📊", title: "Actionable Insights", description: "Track volume, drop-offs, and conversion trends with clear analytics." },
];

const steps: Step[] = [
  { id: "01", icon: "🔗", title: "Connect your channels", description: "We integrate your website and messaging channels with secure handoff and routing." },
  { id: "02", icon: "🧠", title: "Train your assistant", description: "Your FAQs, offers, and business rules are configured so responses stay accurate." },
  { id: "03", icon: "🚀", title: "Go live and optimize", description: "Launch quickly, then improve intent handling and conversion from real conversations." },
];

const pricingPlans: PricingPlan[] = [
  { title: "Starter", description: "For solo founders and small teams", monthlyPrice: "₹3,999", onetimePrice: "₹4,999", features: ["1 website chatbot", "500 messages/mo", "Lead capture", "Email support"], popular: false },
  { title: "Pro", description: "For growth-stage businesses", monthlyPrice: "₹7,999", onetimePrice: "₹9,999", features: ["Everything in Starter", "WhatsApp + Instagram", "2,000 messages/mo", "Appointment booking"], popular: true },
  { title: "Business", description: "For high-volume operations", monthlyPrice: "₹15,999", onetimePrice: "₹19,999", features: ["Everything in Pro", "Unlimited messages", "CRM integration", "Priority support"], popular: false },
];

const faqs: Faq[] = [
  { question: "Do I need technical skills to use Kufu?", answer: "No. We handle setup and provide a simple dashboard for updates. Most teams are live in days." },
  { question: "Can Kufu match our brand tone?", answer: "Yes. We configure response tone, escalation rules, and fallback paths to match your workflows." },
  { question: "What if the AI cannot answer correctly?", answer: "You can enable human handoff to your team via Slack, email, or messaging channels for immediate takeover." },
  { question: "Can this integrate with our CRM?", answer: "Yes. We support major CRMs and custom workflows through APIs and automation tools." },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function BotIcon({ size = 18 }: BotIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="3" fill="white" fillOpacity="0.9" />
      <circle cx="9" cy="14" r="1.5" fill="#6366f1" />
      <circle cx="15" cy="14" r="1.5" fill="#6366f1" />
      <path d="M9 18h6" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8V5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1.5" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

function useScrollReveal(): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm text-slate-100 hover:text-white transition-colors"
      >
        {question}
        <svg
          className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{answer}</div>
      )}
    </div>
  );
}


// ── NavbarAuth ─────────────────────────────────────────────────────────────
function NavbarAuth() {
  const navigate = useNavigate();
  const { loading, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 border border-white/10 px-4 py-1.5 rounded-full hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
      >
        Login
      </Link>
    );
  }

  const avatarInitial = (user.email?.charAt(0) ?? "?").toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      onClick={() => setMenuOpen((v) => !v)}
      className="w-9 h-9 rounded-full grad-bg flex items-center justify-center text-white text-sm font-bold shadow-[0_0_0_2px_rgba(99,102,241,0.25)] hover:scale-105 transition-transform overflow-hidden"
    >
      <span>{avatarInitial}</span>
    </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl p-1.5 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <div className="px-3 py-2 mb-1 border-b border-white/[0.07]">
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <Link
            to="/demo"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function HomePage() {
  const [billingMonthly, setBillingMonthly] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .grad-text {
          background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #818cf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .grad-bg { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 70%{box-shadow:0 0 0 10px transparent} 100%{box-shadow:0 0 0 0 transparent} }
        .float-anim { animation: float 5s ease-in-out infinite; }
        .dot-blink   { animation: blink 1.2s ease-in-out infinite; }
        .dot-blink-2 { animation: blink 1.2s ease-in-out 0.2s infinite; }
        .dot-blink-3 { animation: blink 1.2s ease-in-out 0.4s infinite; }
        .badge-shimmer { background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1); background-size: 200% auto; animation: shimmer 3s linear infinite; }
        .pulse-dot { animation: pulse-ring 2s infinite; }
        .nav-link { position: relative; transition: color 0.2s; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:linear-gradient(90deg,#6366f1,#8b5cf6); transition:width 0.25s cubic-bezier(0.22,1,0.36,1); border-radius:99px; }
        .nav-link:hover::after { width: 100%; }
        .hero-enter { animation: hero-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes hero-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`sticky top-0 z-50 w-full px-6 lg:px-10 backdrop-blur-xl transition-all duration-300 ${scrolled ? "bg-slate-950/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-white/[0.06]" : "bg-slate-950/60 border-b border-transparent"}`}>
        <div className="max-w-7xl mx-auto h-[62px] grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }} className="flex items-center gap-2.5 justify-self-start group">
            <div className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center flex-shrink-0 shadow-[0_2px_12px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform">
              <BotIcon size={18} />
            </div>
            <span className="font-display font-extrabold text-[1.1rem] tracking-tight text-slate-100 hidden sm:block">Kufu</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {(["Home", "Services", "Pricing", "FAQ", "Contact", "Case Studies"] as const).map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(" ", "-")}`}
                onClick={(e) => { e.preventDefault(); scrollTo(l.toLowerCase().replace(" ", "-")); }}
                className="nav-link text-sm font-medium text-slate-400 hover:text-indigo-300 whitespace-nowrap"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5 justify-self-end">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
              className="hidden md:inline-flex items-center gap-2 grad-bg text-white text-sm font-bold px-5 py-2 rounded-full shadow-[0_2px_14px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)] transition-all whitespace-nowrap"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get a Free Demo
            </a>
            <div className="hidden md:block w-px h-5 bg-white/10" />
            <NavbarAuth />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
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
              <button type="button" onClick={() => scrollTo("contact")} className="inline-flex items-center gap-2 grad-bg text-white font-bold text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)] transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                Request a Free Demo
              </button>
              <button type="button" onClick={() => scrollTo("pricing")} className="font-semibold text-sm px-6 py-3 rounded-full border border-white/10 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all">
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
                  👋 Hi! I'm Kufu. How can I help you today?
                </div>
                <div className="self-end max-w-[80%] rounded-[18px_18px_4px_18px] bg-white/[0.05] border border-white/[0.08] px-4 py-2.5 text-sm text-slate-300 leading-relaxed">
                  I'd like to learn more about pricing
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

      {/* ── STEPS ── */}
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

      {/* ── OUTCOMES ── */}
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

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">Pricing</p>
            <h2 className="font-display font-black text-white mb-2" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.02em" }}>Transparent Pricing</h2>
            <p className="text-slate-400 mb-8">Start with a 7-day pilot. Pay setup only after pilot success.</p>
            <div className="inline-flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-full px-5 py-2.5">
              <span className={`text-sm font-semibold transition-colors ${!billingMonthly ? "text-indigo-300" : "text-slate-500"}`}>One-time setup</span>
              <button
                type="button"
                onClick={() => setBillingMonthly((v) => !v)}
                className={`relative w-12 h-6 rounded-full border border-white/10 transition-colors duration-300 ${billingMonthly ? "bg-indigo-500" : "bg-slate-700"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${billingMonthly ? "translate-x-6" : "translate-x-0"}`} />
              </button>
              <span className={`text-sm font-semibold transition-colors ${billingMonthly ? "text-indigo-300" : "text-slate-500"}`}>Monthly</span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <Reveal key={plan.title} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${plan.popular ? "border-indigo-500/50 bg-indigo-500/[0.07]" : "border-white/[0.08] bg-white/[0.02]"}`}>
                  {plan.popular && <div className="absolute top-0 left-0 right-0 h-0.5 grad-bg" />}
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-display font-extrabold text-lg text-white">{plan.title}</p>
                    {plan.popular && <span className="text-[0.65rem] font-bold tracking-wider uppercase badge-shimmer text-white px-2.5 py-1 rounded-full">Popular</span>}
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
                  <button
                    type="button"
                    onClick={() => scrollTo("contact")}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${plan.popular ? "grad-bg text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)]" : "border border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300"}`}
                  >
                    Get Started
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 lg:px-10 bg-gradient-to-b from-indigo-950/20 to-transparent">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-indigo-400 mb-3">FAQ</p>
            <h2 className="font-display font-black text-white" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.02em" }}>Frequently Asked Questions</h2>
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

      {/* ── CTA ── */}
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

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg grad-bg flex items-center justify-center"><BotIcon size={14} /></div>
            <span className="font-display font-extrabold text-slate-100">Kufu</span>
            <span className="text-sm text-slate-600 ml-2">© 2025 All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            {(["Privacy", "Terms", "Support"] as const).map((l) => (
              <a key={l} href="#" className="text-sm text-slate-500 hover:text-indigo-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── FLOATING CHAT ── */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-[320px] rounded-2xl overflow-hidden border border-indigo-500/20 bg-slate-900 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="grad-bg px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><BotIcon size={16} /></div>
              <div>
                <p className="text-sm font-bold text-white">Kufu Assistant</p>
                <p className="text-[0.7rem] text-white/70">Typically replies instantly</p>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              <div className="self-start max-w-[85%] rounded-[16px_16px_16px_4px] bg-indigo-500/15 border border-indigo-500/20 px-3.5 py-2.5 text-sm text-slate-200 leading-relaxed">
                👋 Hi there! How can I help you today?
              </div>
              <div className="flex gap-2 flex-wrap mt-1">
                {(["See pricing", "Book a demo", "Learn more"] as const).map((t) => (
                  <button key={t} type="button" className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20 transition-colors">{t}</button>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <input type="text" placeholder="Type a message…" className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/50" style={{ fontFamily: "inherit" }} />
              <button type="button" className="w-9 h-9 rounded-xl grad-bg flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setChatOpen((v) => !v)}
          className="rounded-full grad-bg border-none flex items-center justify-center shadow-[0_4px_20px_rgba(99,102,241,0.45)] hover:scale-110 transition-transform"
          style={{ width: 52, height: 52 }}
        >
          {chatOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
