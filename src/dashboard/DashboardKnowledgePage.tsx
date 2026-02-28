import { useEffect, useState } from 'react'

import { ApiError, getDashboardKnowledge, postDashboardKnowledge } from '../lib/api'
import './DashboardKnowledgePage.css'

type FaqItem = {
  question: string
  answer: string
}

function parseFaqItems(input: unknown[]): FaqItem[] {
  return input
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null
      }
      const candidate = item as { question?: unknown; answer?: unknown }
      return {
        question: typeof candidate.question === 'string' ? candidate.question : '',
        answer: typeof candidate.answer === 'string' ? candidate.answer : '',
      }
    })
    .filter((item): item is FaqItem => item !== null)
}

export function DashboardKnowledgePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [servicesText, setServicesText] = useState('')
  const [pricingText, setPricingText] = useState('')
  const [hoursText, setHoursText] = useState('')
  const [contactText, setContactText] = useState('')
  const [knowledgeBaseText, setKnowledgeBaseText] = useState('')
  const [faqs, setFaqs] = useState<FaqItem[]>([])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const response = await getDashboardKnowledge()
        if (!mounted) return
        setServicesText(response.knowledge.services_text ?? '')
        setPricingText(response.knowledge.pricing_text ?? '')
        setHoursText(response.knowledge.hours_text ?? '')
        setContactText(response.knowledge.contact_text ?? '')
        setKnowledgeBaseText(response.knowledge.knowledge_base_text ?? '')
        setFaqs(parseFaqItems(response.knowledge.faqs_json ?? []))
      } catch (loadError) {
        if (!mounted) return
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load knowledge.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const handleFaqChange = (index: number, field: keyof FaqItem, value: string) => {
    setFaqs((current) =>
      current.map((faq, faqIndex) => (faqIndex === index ? { ...faq, [field]: value } : faq)),
    )
  }

  const addFaq = () => {
    setFaqs((current) => [...current, { question: '', answer: '' }])
  }

  const removeFaq = (index: number) => {
    setFaqs((current) => current.filter((_, faqIndex) => faqIndex !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await postDashboardKnowledge({
        services_text: servicesText.trim() || null,
        pricing_text: pricingText.trim() || null,
        hours_text: hoursText.trim() || null,
        contact_text: contactText.trim() || null,
        knowledge_base_text: knowledgeBaseText.trim() || null,
        faqs_json: faqs
          .map((faq) => ({
            question: faq.question.trim(),
            answer: faq.answer.trim(),
          }))
          .filter((faq) => faq.question || faq.answer),
      })
      setSuccess('Knowledge saved successfully.')
    } catch (saveError) {
      setError(saveError instanceof ApiError ? saveError.message : 'Failed to save knowledge.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-knowledge space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Knowledge Base</h1>
        <p className="text-sm text-slate-400">
          This content is injected into chatbot instructions for your tenant.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      <section className="knowledge-card rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5">
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-200">Knowledge Base Text</span>
            <textarea
              className="knowledge-input min-h-[140px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              disabled={loading}
              placeholder="Primary tenant knowledge used in system prompt."
              value={knowledgeBaseText}
              onChange={(event) => setKnowledgeBaseText(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-200">Services Text</span>
            <textarea
              className="knowledge-input min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              disabled={loading}
              placeholder="Describe your services and use cases."
              value={servicesText}
              onChange={(event) => setServicesText(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-200">Pricing Text</span>
            <textarea
              className="knowledge-input min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              disabled={loading}
              placeholder="Add pricing summary for assistant replies."
              value={pricingText}
              onChange={(event) => setPricingText(event.target.value)}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-200">Business Hours</span>
              <textarea
                className="knowledge-input min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                disabled={loading}
                placeholder="Mon-Sat, 9 AM - 7 PM IST"
                value={hoursText}
                onChange={(event) => setHoursText(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-200">Contact Text</span>
              <textarea
                className="knowledge-input min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                disabled={loading}
                placeholder="Email, WhatsApp, call details..."
                value={contactText}
                onChange={(event) => setContactText(event.target.value)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="knowledge-card rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-white">FAQs</h2>
          <button
            className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20"
            type="button"
            onClick={addFaq}
          >
            Add FAQ
          </button>
        </div>

        <div className="space-y-3">
          {faqs.length === 0 ? (
            <p className="text-sm text-slate-400">No FAQ items yet.</p>
          ) : (
            faqs.map((faq, index) => (
              <div key={`faq-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Question
                  </span>
                  <input
                    className="knowledge-input w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="What channels do you support?"
                    type="text"
                    value={faq.question}
                    onChange={(event) => handleFaqChange(index, 'question', event.target.value)}
                  />
                </label>
                <label className="mt-2 block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Answer
                  </span>
                  <textarea
                    className="knowledge-input min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="We support website chat, WhatsApp, and Instagram."
                    value={faq.answer}
                    onChange={(event) => handleFaqChange(index, 'answer', event.target.value)}
                  />
                </label>
                <div className="mt-2 text-right">
                  <button
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                    type="button"
                    onClick={() => removeFaq(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={saving || loading}
          type="button"
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save Knowledge'}
        </button>
      </div>
    </div>
  )
}
