# CLAUDE.md — kufu-frontend

## Project Overview

**Kufu** is a SaaS chatbot platform that lets businesses embed an AI-powered chat widget on their website, connect to WhatsApp, and manage customer inquiries. This repo is the **frontend** — React 19 + Vite + TypeScript, deployed on Vercel.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Forms | React Hook Form 7 + Zod 4 |
| Animations | Framer Motion 12 |
| Testing | Vitest 4 + Testing Library + jsdom |
| Deployment | Vercel (`vercel.json`, `build:vercel` script) |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `https://kufu-api.onrender.com`) |
| `VITE_META_APP_ID` | Meta App ID for WhatsApp Embedded Signup |

Set in `.env` locally. Both must be set in Vercel project settings for production.

---

## Project Structure

```
src/
  App.tsx                         # Root router with all route definitions
  main.tsx                        # React entry point, wraps with AuthProvider + ChatProvider + BrowserRouter
  index.css                       # Global styles

  pages/
    HomePage.tsx                  # Marketing landing page (assembled from home/ sections)
    LoginPage.tsx                 # Login form
    CreateAccountPage.tsx         # Registration form (email, password, full name, business name, website URL)
    VerifyEmailPage.tsx           # Token-based email verification
    DemoPage.tsx                  # Book a demo (submits to /api/leads/demo)
    WidgetPage.tsx                # Standalone embedded widget page (rendered in iframe)
    home/
      HeroSection.tsx             # Landing hero
      StepsSection.tsx            # How it works
      OutcomesSection.tsx         # Value props
      PricingSection.tsx          # Pricing cards
      FaqSection.tsx              # FAQ accordion
      FooterSection.tsx           # Footer
      ContactPage.tsx             # Contact form (submits to /api/leads/contact)
      FloatingChat.tsx            # Demo chat on landing page
      HomeData.ts                 # Static content for home sections

  dashboard/
    DashboardLayout.tsx           # Sidebar nav + outlet for all /dashboard/* routes
    DashboardOverviewPage.tsx     # Summary stats + setup progress checklist
    DashboardProfilePage.tsx      # User profile (name, email, website)
    DashboardPlanPage.tsx         # Current plan details
    DashboardUpgradePlanPage.tsx  # Plan upgrade options
    DashboardIntegrationsPage.tsx # Website embed + WhatsApp connect
    DashboardWhatsAppConnectPage.tsx # WhatsApp Embedded Signup flow
    DashboardKnowledgePage.tsx    # Knowledge base editor (services, pricing, FAQs, hours, contact)
    DashboardLeadsPage.tsx        # Captured leads table
    DashboardChatHistoryPage.tsx  # Chat history (starter+ plan gated)
    DashboardAnalyticsPage.tsx    # Analytics charts (pro+ plan gated)
    DashboardChatbotSettingsPage.tsx # Bot name, greeting, primary color
    DashboardTestChatPage.tsx     # Live test chat with the user's own bot
    DashboardSupportPage.tsx      # Submit and view support tickets
    DashboardCustomQuotePage.tsx  # Request a custom plan quote
    DashboardDevTestPage.tsx      # DEV-only API test harness (not in production build)
    components/
      AnalyticsCards.tsx          # Stats cards for overview
      BotCustomizationForm.tsx    # Chatbot name/color/greeting form
      ChatHistoryTable.tsx        # Paginated chat history
      ChatbotTester.tsx           # Inline chatbot test component
      DetectionResultBadge.tsx    # Badge for website type detection result
      InstallGuideCard.tsx        # Step-by-step install guide per platform
      WebsiteTypeDetector.tsx     # Auto-detects website platform (WordPress, Shopify, etc.)

  admin/
    AdminLayout.tsx               # Admin sidebar + outlet
    AdminOverviewPage.tsx         # Global stats across all users
    AdminUsersPage.tsx            # View/manage all users
    AdminMessagesPage.tsx         # View all chat messages
    AdminTicketsPage.tsx          # Manage support tickets
    AdminQuotesPage.tsx           # Manage custom quotes

  components/
    ChatWidget.tsx                # Core reusable chat widget (used in widget page + floating chat)
    GlobalFloatingChat.tsx        # Floating chat button shown on public pages
    FloatingChatButton.tsx        # The trigger button component
    BrandBotIcon.tsx              # SVG bot avatar
    GlassPanel.tsx                # Glassmorphism UI card
    Navbar.tsx                    # Top navigation bar
    NavbarLinks.tsx               # Nav link items
    BottomMobileNav.tsx           # Mobile bottom tab bar
    PricingCard.tsx               # Reusable pricing tier card
    RequireChatbot.tsx            # Guard: ensures user has a chatbot before showing content
    ScrollToTop.tsx               # Resets scroll on route change

  lib/
    api.ts                        # ALL API call functions + all TypeScript types for API
    auth-context.tsx              # AuthContext: login, register, logout, verifyEmail, refreshMe
    chat-context.tsx              # ChatContext: chat session state
    chat.ts                       # Chat utility functions
    types.ts                      # Shared UI types (Message, etc.)
    protected-route.tsx           # ProtectedRoute: redirects to /login if not authenticated
    plan-protected-route.tsx      # PlanProtectedRoute: gates routes by plan tier
    brand.ts                      # Brand name/color constants
    dashboard-setup-progress.ts   # Computes onboarding checklist completion
    motion.ts                     # Framer Motion animation presets
    storage.ts                    # localStorage helpers
    utils.ts                      # General helpers
    validation.ts                 # Shared Zod schemas
    authError.ts                  # Auth error type helpers
    scrollToId.ts                 # Smooth scroll to element
    useScrollFromLocationState.ts # Hook for scroll-to after navigation

  assets/
    logo.png, newlogo.png, officiallogo.jpeg, small-logo.png
```

---

## Routes

| Route | Access | Component |
|---|---|---|
| `/` | Public | HomePage |
| `/demo` | Public | DemoPage |
| `/contact` | Public | ContactPage |
| `/widget` | Public | WidgetPage |
| `/login` | Public | LoginPage |
| `/create-account` | Public | CreateAccountPage |
| `/verify` | Public | VerifyEmailPage |
| `/dashboard` | Auth required | DashboardOverviewPage |
| `/dashboard/profile` | Auth required | DashboardProfilePage |
| `/dashboard/plan` | Auth required | DashboardPlanPage |
| `/dashboard/upgrade` | Auth required | DashboardUpgradePlanPage |
| `/dashboard/integrations` | Auth required | DashboardIntegrationsPage |
| `/dashboard/integrations/whatsapp/connect` | Auth required | DashboardWhatsAppConnectPage |
| `/dashboard/knowledge` | Auth required | DashboardKnowledgePage |
| `/dashboard/leads` | Auth required | DashboardLeadsPage |
| `/dashboard/chat-history` | Starter+ plan | DashboardChatHistoryPage |
| `/dashboard/analytics` | Pro+ plan | DashboardAnalyticsPage |
| `/dashboard/chatbot-settings` | Auth required | DashboardChatbotSettingsPage |
| `/dashboard/test-chat` | Auth required | DashboardTestChatPage |
| `/dashboard/support` | Auth required | DashboardSupportPage |
| `/dashboard/custom-quote` | Auth required | DashboardCustomQuotePage |
| `/dashboard/dev-test` | DEV only | DashboardDevTestPage |
| `/admin` | Admin role | AdminOverviewPage |
| `/admin/users` | Admin role | AdminUsersPage |
| `/admin/messages` | Admin role | AdminMessagesPage |
| `/admin/tickets` | Admin role | AdminTicketsPage |
| `/admin/quotes` | Admin role | AdminQuotesPage |
| `*` | — | Redirects to `/` |

---

## Authentication

- JWT stored in `localStorage` under key `kufu_auth_token_v1`
- Backend also sets HTTP-only cookie `kufu_session` (7-day expiry)
- Auth is managed via `AuthContext` in `src/lib/auth-context.tsx`
- `ProtectedRoute` checks `isAuthenticated`; redirects to `/login` if not
- `PlanProtectedRoute` checks `plan.code` against a minimum plan tier
- Admin routes check `user.role === 'admin'`
- `setApiAuthToken(token)` injects the token into all subsequent API calls

---

## Plan Tiers

Plans: `free` → `starter` → `pro` → `business`

- `/dashboard/chat-history`: requires `starter` or higher
- `/dashboard/analytics`: requires `pro` or higher
- Message quotas enforced on backend per plan

---

## API Layer

All API calls go through `src/lib/api.ts`. Base URL from `VITE_API_BASE_URL`.

Key functions:
- `postRegister`, `postLogin`, `postLogout`, `getMe`, `postVerifyEmail`
- `getDashboardSummary`, `getDashboardLeads`, `getDashboardKnowledge`, `updateDashboardKnowledge`
- `getDashboardChatbots`, `createDashboardChatbot`, `updateDashboardChatbot`
- `getDashboardChatHistory`, `getDashboardAnalytics`
- `getDashboardTickets`, `createDashboardTicket`
- `getDashboardQuotes`, `createDashboardQuote`
- `getWhatsAppIntegration`, `startWhatsAppOnboarding`, `completeWhatsAppOnboarding`
- `postChat`, `postChatLog`
- `postDemoLead`, `postContactLead`
- `detectWebsiteType`

---

## Tests

Location: `tests/`

- `chat-widget.test.tsx` — ChatWidget renders, sends messages
- `contact-page.test.tsx` — Contact form validation
- `create-account.validation.test.tsx` — Registration form validation
- `dashboard-overview.test.tsx` — Dashboard overview renders
- `demo-page.test.tsx` — Demo page form
- `login-page.test.tsx` — Login form
- `protected-route.test.tsx` — Route guard behavior
- `website-type-detector.test.tsx` — Site detection component

Run: `npm test`

---

## Build & Deploy

```bash
npm run dev        # local dev server (port 5173)
npm run build      # generate:brand-assets → tsc → vite build
npm run typecheck  # tsc type check
npm run lint       # eslint (zero warnings tolerance)
npm test           # vitest run
```

Deployed to **Vercel**. `vercel.json` handles SPA routing rewrites.

---

## Known Gaps / Pre-Launch TODO

See full pre-launch audit in the main conversation context.
