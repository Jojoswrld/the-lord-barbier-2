# Archived: "barbería y uñas" version (6 November 2026)

An earlier, separate version of The Lord Barbier website, saved before the work Cloudflare
account is cleared. Its source was never in a GitHub repo; this is an exact copy of the files it
served at `https://the-lord-barbier.arenalweb.workers.dev` (a Cloudflare Worker on the work
account, last changed 6 November 2026), downloaded on 8 November 2026.

It is plain HTML, CSS and JavaScript (no build step). It is **not** part of the current site:
Vite does not build or deploy this folder.

## What's different from the current site

- Also promotes **Nicole's nail corner** ("el rincón de uñas de Nicole"), with its own services tab
- Booking card with day buttons (Today, Tomorrow, …) and hourly time slots
- Uses WhatsApp **+506 6180-5577** (the current site uses +506 6413-8832); both numbers appear in public listings
- Map pinned to exact coordinates 10.4718954, -84.6406232, plus a Waze link
- Fonts: Oswald, Archivo and Archivo Narrow

## View it

Open the folder with any static file server, for example:

```bash
npx http-server archive/2026-11-06-barberia-y-unas
```

(Opening it through `npm run dev` shows it unstyled, because Vite tries to process its CSS imports.)
