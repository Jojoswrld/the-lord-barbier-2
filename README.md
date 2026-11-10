# The Lord Barbier 2

Bilingual (Spanish / English) website for The Lord Barbier, a classic barbershop in La Fortuna, San Carlos, Costa Rica (since 2020). Black and white, with WhatsApp booking.

**Live:** https://the-lord-barbier-2.lavalogic.workers.dev

Its sister site, The Lord Barbier 1 (the first version, with Nicole's nail corner), is the repo `the-lord-barbier-1`.

Villa / hotel QR card (printable A6): https://the-lord-barbier-2.lavalogic.workers.dev/villa-card

## Built with

Vite + React + TypeScript, Tailwind CSS v4, shadcn/ui (Base UI). Fonts: Rokkitt and Archivo (Google Fonts). Deployed as a Cloudflare Worker (static assets from `dist`).

## Edit content

Copy, prices, services, contact details and photos live in `src/content.ts`. Business details for Google and link previews are in `index.html`.

Still to fill in: prices (shown as "₡ —") and opening hours.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
npx wrangler deploy
```

If a custom domain is added, update the site URL in `index.html`, `public/robots.txt` and `public/sitemap.xml`, and regenerate the QR code in `public/villa-card.html`.
