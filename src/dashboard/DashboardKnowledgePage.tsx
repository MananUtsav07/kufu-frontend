import { type ChangeEvent, useEffect, useMemo, useState } from 'react'

import { useAuth } from '../lib/auth-context'
import {
  ApiError,
  deleteDashboardKbFile,
  getDashboardChatbots,
  getDashboardKbFiles,
  getDashboardKnowledge,
  postDashboardKbFile,
  postDashboardKnowledge,
  type DashboardChatbot,
  type DashboardKbFile,
} from '../lib/api'
import './DashboardKnowledgePage.css'

type FaqItem = {
  question: string
  answer: string
}

const STARTER_PLUS_PLANS = new Set(['starter', 'pro', 'business'])

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

function formatFileSize(fileSize: number): string {
  if (fileSize < 1024) {
    return `${fileSize} B`
  }
  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`
  }
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
}

export function DashboardKnowledgePage() {
  const { plan, isAdmin } = useAuth()
  const canUploadKbFiles = useMemo(() => {
    if (isAdmin) {
      return true
    }

    const planCode = typeof plan?.code === 'string' ? plan.code.toLowerCase() : ''
    return STARTER_PLUS_PLANS.has(planCode)
  }, [isAdmin, plan?.code])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadingKb, setUploadingKb] = useState(false)
  const [removingKbFileId, setRemovingKbFileId] = useState<string | null>(null)

  const [chatbots, setChatbots] = useState<DashboardChatbot[]>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState<string>('')
  const [kbFiles, setKbFiles] = useState<DashboardKbFile[]>([])

  const [servicesText, setServicesText] = useState('')
  const [pricingText, setPricingText] = useState('')
  const [hoursText, setHoursText] = useState('')
  const [contactText, setContactText] = useState('')
  const [knowledgeBaseText, setKnowledgeBaseText] = useState('')
  const [faqs, setFaqs] = useState<FaqItem[]>([])

  const loadKnowledgeAndChatbots = async () => {
    setLoading(true)
    setError(null)

    try {
      const [knowledgeResponse, chatbotResponse] = await Promise.all([
        getDashboardKnowledge(),
        getDashboardChatbots(),
      ])

      setServicesText(knowledgeResponse.knowledge.services_text ?? '')
      setPricingText(knowledgeResponse.knowledge.pricing_text ?? '')
      setHoursText(knowledgeResponse.knowledge.hours_text ?? '')
      setContactText(knowledgeResponse.knowledge.contact_text ?? '')
      setKnowledgeBaseText(knowledgeResponse.knowledge.knowledge_base_text ?? '')
      setFaqs(parseFaqItems(knowledgeResponse.knowledge.faqs_json ?? []))

      setChatbots(chatbotResponse.chatbots)
      if (chatbotResponse.chatbots.length > 0) {
        setSelectedChatbotId((current) => current || chatbotResponse.chatbots[0].id)
      } else {
        setSelectedChatbotId('')
      }
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load knowledge.')
    } finally {
      setLoading(false)
    }
  }

  const loadKbFiles = async (chatbotId: string) => {
    if (!chatbotId) {
      setKbFiles([])
      return
    }

    try {
      const response = await getDashboardKbFiles(chatbotId)
      setKbFiles(response.files)
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load knowledge files.')
    }
  }

  useEffect(() => {
    void loadKnowledgeAndChatbots()
  }, [])

  useEffect(() => {
    if (!selectedChatbotId) {
      setKbFiles([])
      return
    }

    void loadKbFiles(selectedChatbotId)
  }, [selectedChatbotId])

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

  const handleKbUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !selectedChatbotId) {
      return
    }

    setError(null)
    setUploadingKb(true)
    try {
      await postDashboardKbFile(selectedChatbotId, file)
      await loadKbFiles(selectedChatbotId)
    } catch (uploadError) {
      setError(uploadError instanceof ApiError ? uploadError.message : 'Failed to upload knowledge file.')
    } finally {
      setUploadingKb(false)
    }
  }

  const handleDeleteKbFile = async (fileId: string) => {
    setError(null)
    setRemovingKbFileId(fileId)
    try {
      await deleteDashboardKbFile(fileId)
      setKbFiles((current) => current.filter((item) => item.id !== fileId))
    } catch (removeError) {
      setError(removeError instanceof ApiError ? removeError.message : 'Failed to remove knowledge file.')
    } finally {
      setRemovingKbFileId(null)
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

      {!canUploadKbFiles ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Upgrade to Starter or above to upload PDF/DOC/DOCX knowledge files.
        </div>
      ) : null}

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
          <h2 className="text-sm font-semibold text-white">Knowledge Files</h2>
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-200"
              value={selectedChatbotId}
              onChange={(event) => setSelectedChatbotId(event.target.value)}
            >
              {chatbots.length === 0 ? <option value="">No chatbot</option> : null}
              {chatbots.map((chatbot) => (
                <option key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </option>
              ))}
            </select>
            {canUploadKbFiles ? (
              <label className="cursor-pointer rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20">
                {uploadingKb ? 'Uploading...' : 'Upload File'}
                <input
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  disabled={!selectedChatbotId || uploadingKb}
                  type="file"
                  onChange={(event) => {
                    void handleKbUpload(event)
                  }}
                />
              </label>
            ) : null}
          </div>
        </div>
        <p className="mb-3 text-xs text-slate-400">
          Supported formats: PDF, DOC, DOCX. Max 10MB per file.
        </p>
        <div className="space-y-2">
          {kbFiles.length === 0 ? (
            <p className="text-sm text-slate-400">No knowledge files uploaded yet.</p>
          ) : (
            kbFiles.map((file) => (
              <div
                key={file.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{file.filename}</p>
                  <p className="text-xs text-slate-400">
                    {file.mime_type} • {formatFileSize(file.file_size)}
                  </p>
                </div>
                <button
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={removingKbFileId === file.id}
                  type="button"
                  onClick={() => {
                    void handleDeleteKbFile(file.id)
                  }}
                >
                  {removingKbFileId === file.id ? 'Removing...' : 'Delete'}
                </button>
              </div>
            ))
          )}
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
          onClick={() => {
            void handleSave()
          }}
        >
          {saving ? 'Saving...' : 'Save Knowledge'}
        </button>
      </div>
    </div>
  )
}

