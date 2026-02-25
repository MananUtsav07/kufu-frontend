import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

import { BottomMobileNav } from '../components/BottomMobileNav'
import { Navbar } from '../components/Navbar'
import { fadeInUp, staggerContainer } from '../lib/motion'

type CaseStudy = {
  category: string
  title: string
  challenge: string
  solution: string
  metricOne: { value: string; label: string }
  metricTwo: { value: string; label: string }
  imageUrl: string
}

const caseStudies: CaseStudy[] = [
  {
    category: 'Hospitality',
    title: 'Marriott Hotels',
    challenge:
      'Guests asking booking availability and pricing after hours.',
    solution:
      'AI-powered virtual concierge handles room availability queries and booking assistance 24/7.',
    metricOne: { value: '-70%', label: 'Response Time' },
    metricTwo: { value: 'Higher', label: 'Website Chat Bookings' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhAj_TSLUVFERughcho5WyWgtGW-y3qaipt8IOOPfFv_vzcGBt-xKjMJV8tLVxmTbN0y_xnEZjemxOKn2l1hOsA1w31JhE90rJz7V3YGKyAdbkhNq6As_m9UYZCgVCrTBdUm7lj1x8Y5aLIemfyxorZR_9hBZYUWiLUm4Omhf_owYngNTGXItB-j296ZEkC3ynf-soH-Dn9UFyXE25sz1iePwiYobKN1TumX0kVh1WFwgiGiA9YYOvKO8oWBSJa5he8V1hWa4sz68',
  },
  {
    category: 'Fitness',
    title: 'Anytime Fitness',
    challenge:
      'High volume of membership inquiries via website and social media.',
    solution:
      'Automated lead qualification chatbot integrated with CRM.',
    metricOne: { value: '3x', label: 'Tour Bookings' },
    metricTwo: { value: 'Reduced', label: 'Front-Desk Workload' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4xxo0ShfqD5v5Po1Hkc3hKkJ6TJBB0IgOIdOzkbH6gtL-p47Za6AkWM2wwqGmz1vkmamfcHGX3PLZ5er-StzjkJbejoIrO2z1lCwu5anyD-VT2LIvx5ogIMTpAQJ_URY-QLEbFtB_xxn0NMjvuLUjprNBJtzrb2X0VfAD1Qza4J-lWbIc0L1hhtkBkOow8JWYGO4QRTPJoaXUGV-GxQskbGe_SeJBREyN_regu5edW-iGChur9q7AuLgNb3mMjt1xR9YLVAsMoXo',
  },
  {
    category: 'Education',
    title: 'BYJU’S',
    challenge:
      'Handling repetitive questions about courses and pricing.',
    solution:
      'AI assistant trained on FAQs to pre-qualify student inquiries.',
    metricOne: { value: '-60%', label: 'Support Load' },
    metricTwo: { value: 'Higher', label: 'Enrollment Conversion' },
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCihNNdeeFeKsCYD1Ep5A1lRG3AS7jK47wbE6LyVKLOYMtLgssQ4HCGpEtbo0_nzq-B101A5wUpEczK81Y7nd9Gnd88Vhq1NHdc9_Fs5JaNSrLaXRF3aK5wCxUEgbQu5KQUG0L_fyGM3YfP-Hrr3qvhiJCTa-YS7-p7R3SpEU24yjGU04_kUR8lAj6A2HQj7gcAOaUVbOyZohXSMoi58VrHKS1j9QWVjYqEYdtm1mER_6B-QqBS0-ElznqqS55f4mWUfk1iCeXObi0',
  },
]

export function CaseStudiesPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <Navbar page="case-studies" />

      <motion.main
        className="mx-auto w-full max-w-5xl flex-1 pb-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.08, 0.08)}
      >
        <motion.section
          className="px-4 pb-6 pt-10 text-center lg:flex lg:items-center lg:gap-12 lg:text-left"
          variants={fadeInUp}
        >
          <div className="flex-1">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
              Proven AI Automation Use Cases
            </p>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white lg:text-5xl">
              Real Results with <span className="text-primary">AI Automation</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg font-normal text-slate-600 dark:text-slate-400">
              Explore how our intelligent lead processing engine transforms missed opportunities
              into loyal customers across diverse industries.
            </p>
          </div>

          <div className="hidden w-1/3 rounded-3xl border border-primary/10 bg-primary/5 p-6 lg:block">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="font-medium">1.2M+ Leads Processed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">speed</span>
                <span className="font-medium">2s Avg. Response Time</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div className="space-y-6 px-4" variants={staggerContainer(0.05, 0.08)}>
          {caseStudies.map((study) => (
            <motion.article key={study.title} className="group @container" variants={fadeInUp}>
              <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition-all duration-300 hover:border-primary/40 dark:border-primary/10 dark:bg-primary/5">
                <div className="grid grid-cols-1 @xl:grid-cols-12">
                  <div className="relative h-56 overflow-hidden @xl:col-span-4 @xl:h-auto">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${study.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent @xl:hidden" />
                    <div className="absolute bottom-4 left-4 @xl:hidden">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {study.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col p-6 lg:p-8 @xl:col-span-8">
                    <div className="mb-2 hidden @xl:block">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        {study.category}
                      </span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                      {study.title}
                    </h3>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase text-primary">The Challenge</h4>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase text-primary">The Solution</h4>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-primary/10">
                      <div className="flex gap-8">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {study.metricOne.value}
                          </span>
                          <span className="text-xs uppercase text-slate-500">{study.metricOne.label}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {study.metricTwo.value}
                          </span>
                          <span className="text-xs uppercase text-slate-500">{study.metricTwo.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          className="mt-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400"
          variants={fadeInUp}
        >
          Examples shown are industry use cases demonstrating typical results from AI automation.
        </motion.p>

        <motion.section className="mt-16 px-4" variants={fadeInUp}>
          <div className="rounded-2xl bg-primary p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to be our next success story?</h2>
            <p className="mx-auto mb-8 max-w-xl text-slate-100/80">
              Join hundreds of businesses scaling operations with Kufu intelligent automation.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                className="rounded-lg bg-white px-8 py-3 font-bold text-primary transition-colors hover:bg-slate-100"
                type="button"
                onClick={() => navigate('/demo')}
              >
                Book a Free Demo
              </button>
              <Link
                className="rounded-lg border border-white/20 bg-primary/20 px-8 py-3 font-bold text-white transition-colors hover:bg-primary/30"
                to="/"
                state={{ scrollTo: 'pricing' }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <BottomMobileNav variant="case-studies" />
    </div>
  )
}
