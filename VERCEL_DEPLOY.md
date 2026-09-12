# Speedrizer — Vercel Deployment

## Target

- **Project:** `speedrizer`
- **Production URL:** `https://speedrizer.vercel.app`
- **Framework:** Vite + React + TypeScript
- **Build command:** `pnpm build`
- **Output directory:** `dist/public`

## Deployment checklist

1. Import repository ini ke Vercel.
2. Pastikan project name di Vercel adalah `speedrizer` agar URL default menjadi `speedrizer.vercel.app`.
3. Gunakan Node.js 22 dan package manager pnpm.
4. Biarkan `vercel.json` mengatur build command dan output directory.
5. Setelah deploy, cek `/brand/speedrizer-favicon.png`, `/brand/og-cover.jpg`, serta audio/video pada halaman utama.

## Asset strategy

Semua aset media sudah disertakan di `client/public/media` agar deployment Vercel tidak bergantung pada private storage. Favicon, mark navbar, dan OG cover berada di `client/public/brand`.
