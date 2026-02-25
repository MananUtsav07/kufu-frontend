# Vercel Split Deployment

This repo now has two deploy targets:

- `kufu-frontend` (Vite app)
- `kufu-backend` (Express API)

## Frontend Project (Vercel)

- Root Directory: `kufu-frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment Variables:

- `VITE_API_BASE_URL=https://<backend-project>.vercel.app`
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`

## Backend Project (Vercel)

- Root Directory: `kufu-backend`
- Framework Preset: `Other`

Environment Variables:

- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=gpt-4o-mini` (optional)
- `CORS_ORIGIN=https://<frontend-project>.vercel.app,https://*.vercel.app`
- `DATA_DIR=/tmp/kufu-data` (optional)

## Notes

- Backend logs written to `/tmp` on Vercel are ephemeral.
- For durable storage, move logs/leads to a database.
