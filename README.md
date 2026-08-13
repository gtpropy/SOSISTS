# ISTS — Innovation, Science & Technology Society

The official website for the **Innovation, Science & Technology Society (ISTS)** at SOS Hermann
Minor School — *"Learn. Build. Innovate."*

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**, statically
exported for deployment on **Cloudflare Pages**. Sound effects are synthesized on the fly with
the Web Audio API — no external audio assets required.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building

This project uses Next.js static export (`output: "export"` in `next.config.ts`), so
`next build` produces a fully static site in `out/`:

```bash
npm run build
```

## Deploying to Cloudflare Pages

### Option A — Git integration (recommended)

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, create a new Pages project connected to the repo.
3. Set:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Deploy. Cloudflare rebuilds automatically on every push.

### Option B — Deploy from the CLI with Wrangler

```bash
npm run deploy
```

This runs `next build` and then `wrangler pages deploy out` using the included
`wrangler.toml`. You'll need to be logged in via `npx wrangler login` first.

### Local preview of the static build

```bash
npm run preview
```

Runs the production build and serves it locally through `wrangler pages dev`.

## Project structure

```
src/
  app/            Route pages (App Router) — home, about, focus-areas, events, team, join
  components/      Shared UI: nav, footer, animated backgrounds, cards, sound provider
  lib/
    data.ts        All club content (vision, mission, objectives, events, team roster)
    sound.ts        Synthesized UI sound effects (Web Audio API)
```

## Content source

Club content (vision, mission, objectives, focus areas, event structure, safety policy, and
membership rules) is sourced from the ISTS Club Proposal. The executive committee roster is
listed on the Team page; phone numbers are intentionally omitted from the public site.
