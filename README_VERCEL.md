# Speedrizër — Vercel deployment

## Deploy lewat Vercel Dashboard

1. Extract ZIP ini ke folder lokal.
2. Buka [Vercel New Project](https://vercel.com/new).
3. Import folder/repository project ini.
4. Framework Preset: **Vite**.
5. Build Command: `pnpm build`.
6. Output Directory: `dist/public`.
7. Klik **Deploy**.

Konfigurasi tersebut sudah tersedia di `vercel.json`, jadi biasanya cukup import project dan deploy. Semua audio, cover, dan logo sudah disalin ke `client/public/media`, sehingga asset akan ikut dipublish sebagai file static di Vercel.

## Deploy lewat Vercel CLI

```bash
unzip speedrizer-metal-site-vercel.zip
cd speedrizer-metal-site
pnpm install
pnpm exec vercel
pnpm exec vercel --prod
```

Jangan upload folder `node_modules` atau `dist` ke repository. Vercel akan menginstall dependency dan membangun output static secara otomatis.
