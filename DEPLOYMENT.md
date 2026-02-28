# Vercel Split Deployment

This repo now has two deploy targets:

- `kufu-frontend` (Vite app)
- `kufu-backend` (Express API)

## Frontend Project (Vercel)

- Root Directory: `kufu-frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment Variables:

- `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`

## Backend Project (Render)

- Root Directory: `kufu-backend`
- Build Command: `npm ci --include=dev && npm run build`
- Start Command: `npm run start`

Environment Variables:

- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=gpt-4o-mini` (optional)
- `FRONTEND_URL=https://<frontend-domain>`
- `BACKEND_BASE_URL=https://<your-render-backend>.onrender.com`
- `ALLOWED_ORIGINS=https://<frontend-domain>`
- `NPM_CONFIG_PRODUCTION=false`

## Notes

- Backend logs written to `/tmp` on Vercel are ephemeral.
- For durable storage, move logs/leads to a database.
