import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { ChatWidget } from '../components/ChatWidget'
import { FloatingChatButton } from '../components/FloatingChatButton'
import { Footer } from '../components/Footer'
import { GlassPanel } from '../components/GlassPanel'
import { Navbar } from '../components/Navbar'
import { PricingCard } from '../components/PricingCard'
import { fadeInUp, staggerContainer, viewportOnce } from '../lib/motion'
import { scrollToId } from '../lib/scrollToId'

const serviceCards = [
  {
    icon: 'chat_bubble',
    title: 'Website Chatbot',
    description: 'Engage visitors instantly on your landing pages and product sites.',
  },
  {
    icon: 'chat',
    title: 'WhatsApp Automation',
    description: "24/7 support and sales via the world's most popular messaging app.",
  },
  {
    icon: 'photo_camera',
    title: 'Instagram DM',
    description: 'Auto-respond to DMs and comments to keep your social engagement high.',
  },
  {
    icon: 'calendar_month',
    title: 'Appointment System',
    description: 'Smart booking logic that syncs with Google Calendar and Outlook.',
  },
]

const pricingPlans = [
  {
    title: 'Starter',
    description: 'Perfect for solo entrepreneurs',
    oneTimePrice: 4999,
    monthlyPrice: 1999,
    features: ['1 Website Chatbot', '500 messages/mo', 'Basic Lead Capture'],
  },
  {
    title: 'Pro',
    description: 'Best for growing businesses',
    oneTimePrice: 9999,
    monthlyPrice: 3999,
    features: [
      'Everything in Starter',
      'WhatsApp + Instagram',
      '2,000 messages/mo',
      'Appointment Booking',
    ],
    isPopular: true,
  },
  {
    title: 'Business',
    description: 'For multi-channel operations',
    oneTimePrice: 19999,
    monthlyPrice: 7999,
    features: [
      'Everything in Pro',
      'Unlimited messages',
      'Custom CRM Integration',
      'Dedicated Account Manager',
    ],
  },
]

export function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [billingMode, setBillingMode] = useState<'oneTime' | 'monthly'>('monthly')
  const location = useLocation()
  const navigate = useNavigate()
  const handledScrollKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (handledScrollKeyRef.current === location.key) {
      return
    }

    handledScrollKeyRef.current = location.key

    const state = location.state as { scrollTo?: string } | null
    const scrollTarget = state?.scrollTo
    if (!scrollTarget) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToId(scrollTarget)
    })

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: null,
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [location.hash, location.key, location.pathname, location.search, location.state, navigate])

  return (
    <>
      <Navbar page="home" />

      <motion.section
        id="home"
        className="relative overflow-hidden pb-16 pt-20 lg:pb-24 lg:pt-32"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm text-slate-400">Automate customer inquiries with AI.</p>
            <h1 className="mb-6 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl lg:text-7xl">
              Never miss a customer inquiry again.
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-slate-400 md:text-xl">
              Kufu helps small businesses automate customer conversations across website, WhatsApp,
              and Instagram — 24/7.
              <span className="mt-4 block text-sm text-slate-400">
                Start with a 7-Day Free AI Automation Pilot — no upfront commitment.
              </span>
            </p>
            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                className="w-full rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(19,37,236,0.4)] sm:w-auto"
                type="button"
                onClick={() => navigate('/demo')}
              >
                Request a Free Demo
              </button>
              <button
                className="w-full rounded-xl bg-slate-800 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-slate-700 sm:w-auto"
                type="button"
                onClick={() => scrollToId('pricing')}
              >
                View Pricing
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-primary">bolt</span>
                <span className="text-sm font-medium">Fast setup</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <span className="text-sm font-medium">Works 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-primary">target</span>
                <span className="text-sm font-medium">Lead capture included</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2 opacity-20">
          <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
        </div>
      </motion.section>

      <motion.section
        id="case-studies"
        className="bg-slate-900/50 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">How it works</h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-primary" />
          </div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1, 0.1)}
          >
            <motion.div variants={fadeInUp}>
              <GlassPanel className="group relative overflow-hidden rounded-2xl p-8">
                <div className="absolute -right-2 -top-2 text-5xl font-black text-primary opacity-10">01</div>
                <div className="mb-6 w-fit rounded-xl bg-primary/20 p-4">
                  <span className="material-symbols-outlined text-3xl text-primary">hub</span>
                </div>
                <h3 className="mb-3 text-xl font-bold">Connect</h3>
                <p className="text-slate-400">
                  Integrate with your website, WhatsApp, and Instagram in minutes with zero coding
                  required.
                </p>
              </GlassPanel>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <GlassPanel className="group relative overflow-hidden rounded-2xl p-8">
                <div className="absolute -right-2 -top-2 text-5xl font-black text-primary opacity-10">02</div>
                <div className="mb-6 w-fit rounded-xl bg-primary/20 p-4">
                  <span className="material-symbols-outlined text-3xl text-primary">settings_suggest</span>
                </div>
                <h3 className="mb-3 text-xl font-bold">Customize</h3>
                <p className="text-slate-400">
                  Train the AI on your business specifics, services, and pricing to handle queries
                  accurately.
                </p>
              </GlassPanel>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <GlassPanel className="group relative overflow-hidden rounded-2xl p-8">
                <div className="absolute -right-2 -top-2 text-5xl font-black text-primary opacity-10">03</div>
                <div className="mb-6 w-fit rounded-xl bg-primary/20 p-4">
                  <span className="material-symbols-outlined text-3xl text-primary">contacts</span>
                </div>
                <h3 className="mb-3 text-xl font-bold">Capture leads</h3>
                <p className="text-slate-400">
                  Watch as the AI qualifies leads and books appointments directly into your
                  calendar.
                </p>
              </GlassPanel>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="services"
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="mb-4 text-3xl font-bold">Our Services</h2>
            <p className="text-slate-400">
              Tailored AI solutions for every touchpoint of your business.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.08, 0.08)}
          >
            {serviceCards.map((service) => (
              <motion.div key={service.title} variants={fadeInUp}>
                <GlassPanel className="rounded-2xl border-slate-800 p-6 transition-all hover:bg-slate-800/50">
                  <span className="material-symbols-outlined mb-4 text-4xl text-primary">
                    {service.icon}
                  </span>
                  <h4 className="mb-2 text-lg font-bold">{service.title}</h4>
                  <p className="text-sm text-slate-400">{service.description}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="pricing"
        className="bg-slate-900/30 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mb-6 text-center text-sm text-slate-400">
              7-Day Free AI Automation Pilot. Setup fee applies only after successful pilot.
            </p>
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm font-medium ${
                  billingMode === 'oneTime' ? '' : 'text-slate-400'
                }`}
              >
                One-time setup
              </span>
              <label
                className="relative inline-flex cursor-pointer items-center"
                htmlFor="billing-mode-toggle"
              >
                <input
                  id="billing-mode-toggle"
                  aria-label="Toggle monthly maintenance pricing"
                  className="peer sr-only"
                  checked={billingMode === 'monthly'}
                  type="checkbox"
                  onChange={() =>
                    setBillingMode((current) => (current === 'monthly' ? 'oneTime' : 'monthly'))
                  }
                />
                <div className="after:content-[''] peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full" />
              </label>
              <span
                className={`text-sm font-medium ${
                  billingMode === 'monthly' ? '' : 'text-slate-400'
                }`}
              >
                Monthly maintenance
              </span>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1, 0.1)}
          >
            {pricingPlans.map((plan) => (
              <motion.div key={plan.title} variants={fadeInUp}>
                <PricingCard
                  billingMode={billingMode}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  monthlyPrice={plan.monthlyPrice}
                  oneTimePrice={plan.oneTimePrice}
                  title={plan.title}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="faq"
        className="bg-slate-900/30 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.05, 0.06)}
          >
            <motion.div variants={fadeInUp}>
              <details className="glass-panel group rounded-xl" open>
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  Do I need technical skills to set it up?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 leading-relaxed text-slate-400">
                  No technical skills are required. Our team handles the initial setup, and the
                  dashboard is designed to be as simple as editing a text document.
                </div>
              </details>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <details className="glass-panel group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  Does the AI sound human?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 text-slate-400">
                  Yes. We use advanced LLMs tailored with your brand voice so conversations feel
                  natural and helpful.
                </div>
              </details>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <details className="glass-panel group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  Can it handle my specific industry knowledge?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 text-slate-400">
                  Absolutely. During onboarding, we use your brochures, price lists, and FAQs to
                  train your custom AI assistant.
                </div>
              </details>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <details className="glass-panel group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  Which languages does the AI support?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 text-slate-400">
                  Our AI supports over 50 languages, including English, Spanish, French, German,
                  Portuguese, and Mandarin.
                </div>
              </details>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <details className="glass-panel group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  Can it sync with my CRM?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 text-slate-400">
                  Yes. We integrate with HubSpot, Salesforce, Pipedrive, and custom workflows via
                  Zapier.
                </div>
              </details>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <details className="glass-panel group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold">
                  What happens if the AI gets stuck?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 text-slate-400">
                  You can enable human handoff so your team is notified instantly on Slack, email,
                  or WhatsApp whenever needed.
                </div>
              </details>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="relative overflow-hidden py-24"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 text-center md:p-16">
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-black text-white md:text-5xl">
                Start your 7-Day Free AI Automation Pilot today.
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 md:text-xl">
                See how AI can handle customer queries before committing to a full setup.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  className="w-full rounded-xl bg-white px-8 py-4 text-lg font-black text-primary transition-all hover:bg-slate-100 sm:w-auto"
                  type="button"
                  onClick={() => navigate('/demo')}
                >
                  Request a Free Demo
                </button>
                <Link
                  className="w-full rounded-xl border-2 border-white/30 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10 sm:w-auto"
                  to="/contact"
                >
                  Speak to Sales
                </Link>
              </div>
            </div>

            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </motion.section>

      <Footer variant="home" />

      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        <AnimatePresence>
          {isChatOpen ? (
            <motion.div
              key="floating-chat"
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChatWidget mode="floating" panelId="floating-chat-widget" />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <FloatingChatButton isOpen={isChatOpen} onToggle={() => setIsChatOpen((open) => !open)} />
      </div>
    </>
  )
}
