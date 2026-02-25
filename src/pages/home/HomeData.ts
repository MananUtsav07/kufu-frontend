import type { Faq, Outcome, PricingPlan, Step } from "./HomeTypes";

export const trustChannels: string[] = [
  "Website",
  "WhatsApp",
  "Instagram",
  "Slack",
  "HubSpot",
  "Salesforce",
];

export const outcomes: Outcome[] = [
  {
    icon: "⚡",
    title: "Faster First Response",
    description: "Respond to every inquiry instantly, even outside business hours.",
  },
  {
    icon: "👥",
    title: "Higher Lead Conversion",
    description: "Capture intent and route qualified leads to your sales flow automatically.",
  },
  {
    icon: "📅",
    title: "Automated Scheduling",
    description: "Book meetings directly into calendar with business-rule checks.",
  },
  {
    icon: "📊",
    title: "Actionable Insights",
    description: "Track volume, drop-offs, and conversion trends with clear analytics.",
  },
];

export const steps: Step[] = [
  {
    id: "01",
    icon: "🔗",
    title: "Connect your channels",
    description: "We integrate your website and messaging channels with secure handoff and routing.",
  },
  {
    id: "02",
    icon: "🧠",
    title: "Train your assistant",
    description: "Your FAQs, offers, and business rules are configured so responses stay accurate.",
  },
  {
    id: "03",
    icon: "🚀",
    title: "Go live and optimize",
    description: "Launch quickly, then improve intent handling and conversion from real conversations.",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    title: "Starter",
    description: "For solo founders and small teams",
    monthlyPrice: "₹3,999",
    onetimePrice: "₹4,999",
    features: ["1 website chatbot", "500 messages/mo", "Lead capture", "Email support"],
    popular: false,
  },
  {
    title: "Pro",
    description: "For growth-stage businesses",
    monthlyPrice: "₹7,999",
    onetimePrice: "₹9,999",
    features: ["Everything in Starter", "WhatsApp + Instagram", "2,000 messages/mo", "Appointment booking"],
    popular: true,
  },
  {
    title: "Business",
    description: "For high-volume operations",
    monthlyPrice: "₹15,999",
    onetimePrice: "₹19,999",
    features: ["Everything in Pro", "Unlimited messages", "CRM integration", "Priority support"],
    popular: false,
  },
];

export const faqs: Faq[] = [
  {
    question: "Do I need technical skills to use Kufu?",
    answer: "No. We handle setup and provide a simple dashboard for updates. Most teams are live in days.",
  },
  {
    question: "Can Kufu match our brand tone?",
    answer: "Yes. We configure response tone, escalation rules, and fallback paths to match your workflows.",
  },
  {
    question: "What if the AI cannot answer correctly?",
    answer:
      "You can enable human handoff to your team via Slack, email, or messaging channels for immediate takeover.",
  },
  {
    question: "Can this integrate with our CRM?",
    answer: "Yes. We support major CRMs and custom workflows through APIs and automation tools.",
  },
];
