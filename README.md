# Kufu Frontend

Vite + React + TypeScript frontend for Kufu marketing pages, customer dashboard, admin panel, and widget UI.

## Tech

- React 19 + React Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Vitest + Testing Library

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - generate brand assets, typecheck, and build production bundle
- `npm run build:vercel` - Vercel build alias
- `npm run lint` - run ESLint (warnings fail CI)
- `npm run typecheck` - run TypeScript checks
- `npm run test` - run frontend smoke tests once
- `npm run test:watch` - run frontend tests in watch mode
- `npm run preview` - preview production build

## Environment variables

Set in `.env.local` for local work, and in Vercel for production:

- `VITE_API_BASE_URL` (required in production)
- `VITE_META_APP_ID` (required for WhatsApp embedded signup UI)

## Main routes

Public:

- `/`
- `/demo`
- `/contact`
- `/widget`
- `/login`
- `/create-account`
- `/verify`

Dashboard:

- `/dashboard`
- `/dashboard/profile`
- `/dashboard/plan`
- `/dashboard/upgrade`
- `/dashboard/integrations`
- `/dashboard/integrations/whatsapp/connect`
- `/dashboard/knowledge`
- `/dashboard/support`
- `/dashboard/custom-quote`
- `/dashboard/leads`
- `/dashboard/chat-history`
- `/dashboard/analytics`
- `/dashboard/chatbot-settings`
- `/dashboard/test-chat`
- `/dashboard/dev-test` (dev only)

Admin:

- `/admin`
- `/admin/users`
- `/admin/messages`
- `/admin/tickets`
- `/admin/quotes`

## Project structure

- `src/pages/*` - public and auth pages
- `src/pages/home/*` - homepage sections and contact page
- `src/dashboard/*` - client dashboard pages/components
- `src/admin/*` - admin pages/layout
- `src/components/*` - shared UI components
- `src/lib/api.ts` - typed API client
- `src/lib/auth-context.tsx` - auth/session state
- `src/lib/protected-route.tsx` - auth and role guards
- `tests/*` - smoke tests and test utilities

## Local run

1. `npm install`
2. set env vars
3. `npm run dev`
4. open `http://localhost:5173`

## CI gates

GitHub Actions (`.github/workflows/ci.yml`) runs on push and PR:

- lint
- typecheck
- tests
- build

## Deployment notes

- Backend CORS must include your frontend domain in `ALLOWED_ORIGINS`.
- For Vercel, set `VITE_API_BASE_URL` and `VITE_META_APP_ID`.
