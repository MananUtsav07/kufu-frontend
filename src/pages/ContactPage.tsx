import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { BottomMobileNav } from '../components/BottomMobileNav'
import { Navbar } from '../components/Navbar'
import { postContactLead } from '../lib/api'
import { fadeInUp, staggerContainer } from '../lib/motion'
import { STORAGE_KEYS, appendStorageItem, getTimestamp } from '../lib/storage'
import { type ContactLeadFormValues, contactLeadSchema } from '../lib/validation'

export function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactLeadFormValues>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (values: ContactLeadFormValues) => {
    setSubmitError(null)

    try {
      await postContactLead(values)

      appendStorageItem(STORAGE_KEYS.contactLeads, {
        ...values,
        createdAt: getTimestamp(),
      })

      setIsSubmitted(true)
      reset({
        firstName: '',
        lastName: '',
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
    <div className="flex min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <Navbar page="contact" />

      <motion.main
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.08, 0.08)}
      >
        <motion.div className="grid grid-cols-1 gap-16 lg:grid-cols-2" variants={staggerContainer(0.08, 0.08)}>
          <motion.div className="space-y-8" variants={fadeInUp}>
            <div>
              <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                Let&apos;s scale your <span className="text-primary">growth.</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Our team is here to help you automate and scale your lead generation process with
                custom AI solutions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="group flex cursor-pointer items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                    Email Us
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">hello@kufu.ai</p>
                </div>
              </div>

              <div className="group flex cursor-pointer items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 transition-colors group-hover:bg-green-500 group-hover:text-white">
                  <span className="material-symbols-outlined">chat_bubble</span>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                    WhatsApp
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Remote / India</p>
                </div>
              </div>
            </div>

          </motion.div>

          <motion.div
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
            variants={fadeInUp}
          >
            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contact-first-name">
                    First Name
                  </label>
                  <input
                    id="contact-first-name"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="John"
                    type="text"
                    {...register('firstName')}
                  />
                  {errors.firstName ? (
                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contact-last-name">
                    Last Name
                  </label>
                  <input
                    id="contact-last-name"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Doe"
                    type="text"
                    {...register('lastName')}
                  />
                  {errors.lastName ? (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contact-email">
                  Work Email
                </label>
                <input
                  id="contact-email"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="john@company.com"
                  type="email"
                  {...register('email')}
                />
                {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contact-message">
                  How can we help?
                </label>
                <textarea
                  id="contact-message"
                  className="w-full resize-none rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Tell us about your lead gen goals..."
                  rows={4}
                  {...register('message')}
                />
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                type="submit"
              >
                Send Message
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>

              {isSubmitted ? (
                <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="text-sm font-medium">
                    Message submitted successfully. A specialist will contact you shortly.
                  </p>
                </div>
              ) : null}

              {submitError ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {submitError}
                </div>
              ) : null}

              <p className="text-center text-xs text-slate-500">
                By submitting, you agree to our privacy policy.
              </p>
            </form>
          </motion.div>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            className="mx-auto mt-24 max-w-3xl rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-3xl text-white">check</span>
            </div>
            <h3 className="mb-2 text-2xl font-bold">Message Received!</h3>
            <p className="mx-auto mb-8 max-w-sm text-slate-600 dark:text-slate-400">
              Thank you for reaching out. An AI solutions expert will get back to you within the
              next 2 hours.
            </p>
            <button
              className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
              type="button"
            >
              Back to Dashboard
            </button>
          </motion.div>
        ) : null}
      </motion.main>

      <BottomMobileNav variant="contact" />
    </div>
  )
}
