# WorldMind Site

Premium cinematic product landing + play portal for **WorldMind — Enter the Simulation**.

Separate frontend project (`worldmind-site`). Does not modify the game engine repository ([worldmind-core](https://github.com/JonasAbde/worldmind-core)).

**Production:** https://worldmind.tekup.dk  
**Pages preview:** https://worldmind-site.pages.dev

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion
- Cloudflare Pages (static deploy)

## Product truth (aligned with worldmind-core)

- Simulation-first AI game — not an NPC chatbot
- **WorldMind v1.0-rc8** · **200/200 tests** in core repo
- New Aarhus District 01 · 10 agents · 4 locations
- The Missing Delivery vertical slice · 14 player commands · 3 resolution paths
- Leno companion with evidence guard · Save Browser · Branch Restore · Snapshot Diff
- 2D district view + phone/Leno UI (8 tabs)

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run lint
npm run preview
```

## Assets

Source PNGs live in `public/assets/`. Optimized WebP variants:

```bash
npm run optimize:assets
```

## Deploy (Cloudflare Pages)

Production uses two Cloudflare pieces:

1. **Pages** hosts the static build at `worldmind-site.pages.dev`
2. **Worker** (`worldmind-proxy`) maps `worldmind.tekup.dk` → Pages (auto-provisions DNS + SSL without Zone DNS API access)

One-time setup:

```bash
npm run cf:login
npm run cf:init          # creates worldmind-site Pages project
npm run deploy:worker    # attaches worldmind.tekup.dk via Worker custom domain
```

Deploy after code changes:

```bash
npm run deploy           # build + upload to Cloudflare Pages
```

The Worker proxy is already live; routine deploys only need `npm run deploy`.

Check stack status:

```bash
npm run cf:status
```

### Custom domain

`worldmind.tekup.dk` is served by the `worldmind-proxy` Worker with `custom_domain = true` in `wrangler.toml`. Cloudflare auto-creates DNS and TLS — no manual CNAME required when using this path.

If you prefer Pages-native custom domains instead, add a CNAME `worldmind` → `worldmind-site.pages.dev` (proxied) in **Cloudflare → tekup.dk → DNS**, or run `npm run cf:dns` with a token that has **Zone → DNS → Edit**.

### CI/CD

GitHub Actions workflows (`.github/workflows/`) run lint + build + deploy on push to `main`.

> **Billing block:** If workflows fail with “account is locked due to a billing issue”, fix billing at [GitHub Settings → Billing](https://github.com/settings/billing). Until then, deploy manually with `npm run deploy`.

**Alternative (no GitHub Actions):** Connect the repo in [Cloudflare Workers & Pages](https://dash.cloudflare.com/) → `worldmind-site` → Settings → Builds → Connect to Git. Cloudflare builds and deploys on push without using GitHub Actions minutes.

Required GitHub secrets (for Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Set via `node scripts/setup-github-secrets.mjs` or manually. Prefer a dedicated [API token](https://dash.cloudflare.com/profile/api-tokens) over the wrangler OAuth token.

## Project structure

```txt
src/           React app (sections, UI, product data)
public/assets/ Cinematic landing assets (PNG source + optimized WebP)
workers/       worldmind-proxy Worker (custom domain → Pages)
scripts/       Asset optimization + Cloudflare helpers
dist/          Production build output (deploy this)
wrangler.toml  Worker config (worldmind.tekup.dk custom domain)
```
