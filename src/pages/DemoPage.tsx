import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { BottomMobileNav } from '../components/BottomMobileNav'
import { ChatWidget } from '../components/ChatWidget'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { postDemoLead } from '../lib/api'
import { fadeInUp, staggerContainer } from '../lib/motion'
import { STORAGE_KEYS, appendStorageItem, getTimestamp } from '../lib/storage'
import { type DemoLeadFormValues, demoLeadSchema } from '../lib/validation'

export function DemoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DemoLeadFormValues>({
    resolver: zodResolver(demoLeadSchema),
    defaultValues: {
      fullName: '',
      businessType: 'SaaS / Tech',
      phone: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (values: DemoLeadFormValues) => {
    setSubmitError(null)

    try {
      await postDemoLead(values)

      appendStorageItem(STORAGE_KEYS.demoLeads, {
        ...values,
        createdAt: getTimestamp(),
      })

      setIsSubmitted(true)
      reset({
        fullName: '',
        businessType: 'SaaS / Tech',
        phone: '',
        email: '',
        message: '',
      })
    } catch (error) {
      setIsSubmitted(false)
      setSubmitError(
        error instanceof Error ? error.message : 'Could not submit form. Please try again.',
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <Navbar page="demo" />

      <motion.main
        className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-start gap-12 p-4 md:p-8 lg:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.08, 0.08)}
      >
        <motion.section className="space-y-8" variants={fadeInUp}>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Scale your sales with <span className="text-primary">AI Automation.</span>
            </h1>
            <p className="max-w-lg text-lg text-slate-600 dark:text-slate-400">
              Stop chasing leads manually. Our AI identifies, engages, and qualifies high-intent
              prospects 24/7.
            </p>
          </div>

          <p className="mb-4 text-sm text-slate-400">
            We’ll set up a working AI assistant for your business — free for 7 days.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/50 md:p-8">
            <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    htmlFor="demo-full-name"
                  >
                    Full Name
                  </label>
                  <input
                    id="demo-full-name"
                    className="w-full rounded-lg border-none bg-slate-100 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
                    placeholder="John Doe"
                    type="text"
                    {...register('fullName')}
                  />
                  {errors.fullName ? (
                    <p className="text-xs text-red-500">{errors.fullName.message}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    htmlFor="demo-business-type"
                  >
                    Business Type
                  </label>
                  <select
                    id="demo-business-type"
                    className="w-full rounded-lg border-none bg-slate-100 text-slate-900 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
                    {...register('businessType')}
                  >
                    <option>SaaS / Tech</option>
                    <option>Real Estate</option>
                    <option>E-commerce</option>
                    <option>Service Provider</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    htmlFor="demo-phone"
                  >
                    Phone
                  </label>
                  <input
                    id="demo-phone"
                    className="w-full rounded-lg border-none bg-slate-100 text-slate-900 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    {...register('phone')}
                  />
                  {errors.phone ? <p className="text-xs text-red-500">{errors.phone.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    htmlFor="demo-email"
                  >
                    Email Address
                  </label>
                  <input
                    id="demo-email"
                    className="w-full rounded-lg border-none bg-slate-100 text-slate-900 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
                    placeholder="john@company.com"
                    type="email"
                    {...register('email')}
                  />
                  {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  htmlFor="demo-message"
                >
                  How can we help?
                </label>
                <textarea
                  id="demo-message"
                  className="w-full rounded-lg border-none bg-slate-100 text-slate-900 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Tell us about your lead gen goals..."
                  rows={3}
                  {...register('message')}
                />
              </div>

              <button
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-white transition-all hover:bg-primary/90"
                type="submit"
              >
                Start Free Trial
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>

              {isSubmitted ? (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="text-sm font-medium">
                    Form submitted successfully! Check your email for a demo link.
                  </p>
                </div>
              ) : null}

              {submitError ? (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {submitError}
                </div>
              ) : null}
            </form>
          </div>
        </motion.section>

        <motion.section className="lg:sticky lg:top-24" variants={fadeInUp}>
          <div className="mx-auto w-full max-w-[450px]">
            <ChatWidget mode="embedded" className="h-[600px]" />
          </div>
        </motion.section>
      </motion.main>

      <BottomMobileNav variant="demo" />
      <Footer variant="demo" />
    </div>
  )
}
