# The Lord Barbier

Website for The Lord Barbier, a classic barbershop in La Fortuna, San Carlos, Costa Rica (since 2020).
Bilingual (Spanish / English), black and white, with WhatsApp booking.

Live: https://the-lord-barbier.pages.dev
Villa / hotel QR card (printable A6): https://the-lord-barbier.pages.dev/villa-card

## Stack

Vite + React + TypeScript, Tailwind CSS v4, shadcn/ui (Base UI). Fonts: Rokkitt and Archivo (Google Fonts).

## Editing content

All copy, prices, services, contact details and photos are in `src/content.ts`.
Business details for Google and link previews are in `index.html`.

Still to fill in: prices (shown as "₡ —"), opening hours, and a larger photo of the shop for the hero
(`public/images/shop-interior.jpg` is only 270×600).

## Run locally

```bash
npm install
npm run dev
```

## Deploy (Cloudflare Pages)

```bash
npm run build
npx wrangler pages deploy dist --project-name=the-lord-barbier --branch=main
```

If a custom domain is added, update the site URL in `index.html`, `public/robots.txt` and `public/sitemap.xml`,
and regenerate the QR code in `public/villa-card.html`.
