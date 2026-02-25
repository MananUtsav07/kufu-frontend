# Kufu Frontend

Vite + React + TypeScript frontend for the Kufu website.

## Scripts

- `npm install`
- `npm run dev` (http://localhost:5173)
- `npm run build`
- `npm run preview`
- `npm run lint`

## Environment

Create `.env.local`:

- `VITE_API_BASE_URL=` (leave empty in local dev, set to backend URL in production)
- `VITE_SUPABASE_URL=`
- `VITE_SUPABASE_ANON_KEY=`

## Vercel (Frontend Project)

- Root Directory: `kufu-frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Set Vercel env vars:

- `VITE_API_BASE_URL=https://<your-backend-vercel-domain>`
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`
