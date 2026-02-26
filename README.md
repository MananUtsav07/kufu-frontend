# Kufu Frontend Architecture

This repository is the React + Vite + TypeScript frontend for Kufu.

It contains:
- Public marketing pages (home/demo/case studies/contact)
- JWT-based auth screens (register, verify, login)
- Protected client dashboard
- AI chat widget UI
- Browser API test harness at `/dev/api-test`

## Stack

- Vite + React + TypeScript
- React Router
- TailwindCSS + component/page CSS files
- Framer Motion

## Run

1. Install:
   `npm install`
2. Set env:
   `VITE_API_BASE_URL=http://localhost:8787`
3. Start dev:
   `npm run dev`
4. Build:
   `npm run build`

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | Yes (recommended) | Backend base URL used by `src/lib/api.ts`. Defaults to `http://localhost:8787` if not set. |

## How The Frontend Works

### 1) App bootstrap

- `src/main.tsx` mounts React.
- Providers are layered in this order:
  - `BrowserRouter`
  - `AuthProvider` (JWT auth/session state)
  - `ChatProvider` (chat state + streaming replies)
- Then `App.tsx` renders routes.

### 2) Routing and metadata

- `src/App.tsx` defines all routes and route metadata (title/description).
- `ProtectedRoute` guards `/dashboard/*`.
- `ScrollToTop` resets scroll on route changes.

### 3) Auth lifecycle (custom backend JWT)

- Register (`/create-account`) calls `POST /api/auth/register`.
- Verify (`/verify`) calls `POST /api/auth/verify-email`.
- Login (`/login`) calls `POST /api/auth/login`, receives JWT token.
- Token is stored in localStorage (`kufu_auth_token_v1`) and synced into the API wrapper.
- On app load, `AuthProvider` calls `GET /api/auth/me` to restore session.
- Navbar switches from Login button to avatar dropdown when authenticated.

### 4) Dashboard lifecycle

- `/dashboard/*` pages call backend routes with `Authorization: Bearer <token>`.
- Overview page fetches metrics + leads preview + knowledge snippet.
- Leads page supports filter, pagination, status patch, and CSV export.
- Knowledge page edits `services_text`, `pricing_text`, `hours_text`, `contact_text`, `faqs_json`.
- Profile/Plan are MVP display pages.

### 5) Chat lifecycle

- `ChatProvider` stores history in localStorage.
- Messages are sent to `POST /api/chat` via `streamChat`.
- Supports SSE stream and JSON fallback.
- UI handles retry, typing state, and clear chat.

### 6) API test harness

- `/dev/api-test` runs end-to-end checks against backend.
- It tests auth + dashboard routes and displays pass/fail with payloads.
- If register does not return token, it supports manual token paste for verify step.

## File Map (What Each File Does)

### Root files

| Path | Purpose |
|---|---|
| `package.json` | Scripts and dependencies for Vite/React app. |
| `vite.config.ts` | Vite config, dev server, optional `/api` proxy settings. |
| `tailwind.config.js` | Tailwind theme and plugin configuration. |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | TypeScript build configs. |
| `eslint.config.js` | Linting rules. |
| `index.html` | HTML shell + global meta + font/icon links. |
| `.env.example` | Example frontend env values. |
| `vercel.json` | Vercel frontend deploy config. |
| `DEPLOYMENT.md` | Deployment notes. |
| `scripts/generate-brand-assets.mjs` | Generates favicon/OG assets from logo file. |

### Public assets and reference HTML

| Path | Purpose |
|---|---|
| `public/favicon.ico`, `public/favicon-32x32.png`, `public/favicon-16x16.png` | Favicon assets. |
| `public/og.png` | Social preview image. |
| `stitch/*.html` | Original Stitch source HTML used as conversion references. |

### App entry and global styling

| Path | Purpose |
|---|---|
| `src/main.tsx` | App bootstrap and provider mounting. |
| `src/App.tsx` | Route tree, metadata manager, protected route wiring. |
| `src/index.css` | Tailwind import and global typography classes. |

### Components

| Path | Purpose |
|---|---|
| `src/components/Navbar.tsx` | Top navbar, auth avatar dropdown, desktop/mobile navigation behavior. |
| `src/components/NavbarLinks.tsx` | Reusable nav link list used by navbar desktop/mobile modes. |
| `src/components/ScrollToTop.tsx` | Scroll reset on route change. |
| `src/components/BottomMobileNav.tsx` | Mobile bottom nav used on selected pages. |
| `src/components/ChatWidget.tsx` | Main chat panel UI for floating and embedded usage. |
| `src/components/FloatingChatButton.tsx` | Floating chat open/close trigger. |
| `src/components/BrandBotIcon.tsx` | Brand icon glyph component. |
| `src/components/BotIcon.tsx` | Alternate bot icon for section components. |
| `src/components/PricingCard.tsx` | Reusable pricing card component with billing mode support. |
| `src/components/GlassPanel.tsx` | Shared visual wrapper for glassmorphism blocks. |

### Libraries and state

| Path | Purpose |
|---|---|
| `src/lib/api.ts` | Typed fetch wrapper, auth token injection, API methods, chat streaming parser. |
| `src/lib/auth-context.tsx` | JWT auth provider: login/register/verify/logout/me restore state. |
| `src/lib/protected-route.tsx` | Route guard redirecting unauthenticated users to `/login`. |
| `src/lib/chat-context.tsx` | Chat state manager, send/retry/clear logic, localStorage persistence. |
| `src/lib/chat.ts` | Chat constants/default message/quick logic helpers. |
| `src/lib/storage.ts` | Local storage key management and helper methods. |
| `src/lib/types.ts` | Shared TypeScript message and app types. |
| `src/lib/scrollToId.ts` | Smooth section scrolling by element id. |
| `src/lib/useScrollFromLocationState.ts` | Reads router state and applies delayed section scroll. |
| `src/lib/utils.ts` | CSV export, date formatting, title-case helpers. |
| `src/lib/validation.ts` | Zod/form schemas for frontend forms. |
| `src/lib/motion.ts` | Shared animation variants/timing helpers. |
| `src/lib/authError.ts` | User-friendly auth error formatting. |
| `src/lib/brand.ts` | Brand constants (name/logo references). |

### Marketing pages

| Path | Purpose |
|---|---|
| `src/pages/HomePage.tsx` | Public homepage composition and section orchestration. |
| `src/pages/DemoPage.tsx` | Demo request form page + embedded chatbot panel. |
| `src/pages/CaseStudiesPage.tsx` | Case studies page content. |
| `src/pages/ContactPage.tsx` | Contact page form and contact details. |
| `src/pages/LoginPage.tsx` + `src/pages/LoginPage.css` | Login UI and styling. |
| `src/pages/CreateAccountPage.tsx` + `src/pages/CreateAccountPage.css` | Registration UI and styling. |
| `src/pages/VerifyEmailPage.tsx` + `src/pages/VerifyEmailPage.css` | Email verification token page and styling. |
| `src/pages/ApiTestPage.tsx` + `src/pages/ApiTestPage.css` | Browser API harness for backend endpoint checks. |

### Home section components

| Path | Purpose |
|---|---|
| `src/pages/home/HomeData.ts` | Structured content data for home sections. |
| `src/pages/home/HomeTypes.ts` | Type definitions for home section data. |
| `src/pages/home/HomeStyles.tsx` | Shared class/style helpers used by home sections. |
| `src/pages/home/HeroSection.tsx` | Hero block and primary CTA area. |
| `src/pages/home/PricingSection.tsx` | Pricing section and billing toggle integration. |
| `src/pages/home/OutcomesSection.tsx` | Outcomes/value proposition section. |
| `src/pages/home/StepsSection.tsx` | Step-by-step process section. |
| `src/pages/home/FaqSection.tsx` | FAQ section container. |
| `src/pages/home/FAQItem.tsx` | Individual FAQ accordion item. |
| `src/pages/home/CtaSection.tsx` | Final CTA section. |
| `src/pages/home/FooterSection.tsx` | Footer section composition for home page. |
| `src/pages/home/FloatingChat.tsx` | Home floating chat integration wrapper. |
| `src/pages/home/BotIcon.tsx` | Home-local bot icon variant. |
| `src/pages/home/Reveal.tsx` | Reveal-on-scroll animation helper. |

### Dashboard module (`src/dashboard/`)

| Path | Purpose |
|---|---|
| `DashboardLayout.tsx` + `DashboardLayout.css` | Dashboard shell: sidebar, topbar, nested outlet layout. |
| `DashboardOverviewPage.tsx` + `DashboardOverviewPage.css` | Metrics + recent leads + knowledge snapshot. |
| `DashboardLeadsPage.tsx` + `DashboardLeadsPage.css` | Full leads management, filter, pagination, status updates, CSV export. |
| `DashboardKnowledgePage.tsx` + `DashboardKnowledgePage.css` | Knowledge editor with FAQ add/remove and save. |
| `DashboardProfilePage.tsx` + `DashboardProfilePage.css` | User/client profile display (read-only in MVP). |
| `DashboardPlanPage.tsx` + `DashboardPlanPage.css` | Plan summary and upgrade CTA placeholder. |

### Static assets

| Path | Purpose |
|---|---|
| `src/assets/logo.png` | Primary Kufu logo used by UI and asset generation script. |
| `src/assets/small-logo.png` | Alternate compact logo used in chatbot/header contexts. |
| `src/assets/react.svg` | Default Vite asset (non-critical). |

## API Contract Summary Used By Frontend

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Dashboard (Bearer token):
  - `GET /api/dashboard/metrics`
  - `GET /api/dashboard/leads`
  - `PATCH /api/dashboard/leads/:id`
  - `GET /api/dashboard/knowledge`
  - `POST /api/dashboard/knowledge`
- Other:
  - `GET /api/health`
  - `POST /api/chat`
  - `POST /api/chat/log`
  - `POST /api/leads/demo`
  - `POST /api/leads/contact`

## Notes

- Frontend uses custom JWT auth (not Supabase Auth client SDK).
- Keep `VITE_API_BASE_URL` pointing to your backend domain in production.
- `/dev/api-test` is intended for local/staging validation and debugging.
