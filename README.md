# WorldMind Site

Premium cinematic product landing + play portal for **WorldMind — Enter the Simulation**.

Separate frontend project (`worldmind-site`). Does not modify the game engine repository ([worldmind-core](https://github.com/JonasAbde/worldmind-core)).

**Production:** https://worldmind.tekup.dk  
**Pages preview:** https://worldmind-site.pages.dev

Production status: **LIVE** — Git-connected Cloudflare Pages + Worker custom domain routing.

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
npm run cf:git             # git-connected Pages project (already done for production)
npm run deploy:worker      # attaches worldmind.tekup.dk via Worker custom domain
```

Deploy after code changes — push to `main` and Cloudflare builds automatically:

```bash
git push origin main
```

Manual redeploy without a new commit:

```bash
npm run cf:deploy
```

Local emergency build + upload (bypasses Git; prefer `git push`):

```bash
npm run deploy:local
```

Check stack status and run full production verification:

```bash
npm run cf:status
npm run cf:verify
```

### Custom domain (production routing)

`worldmind.tekup.dk` is routed by the `worldmind-proxy` Worker (`wrangler.worker.toml`). Cloudflare auto-provisions DNS and TLS on `tekup.dk` without Zone DNS API access.

Pages hosts the build; the Worker forwards traffic to `worldmind-site.pages.dev`.

Optional later: switch to Pages-native domain with `npm run cf:migrate-domain` (requires `CLOUDFLARE_API_TOKEN` with Zone DNS Edit).

### CI/CD (Cloudflare Git — no GitHub Actions)

Pushes to `main` trigger Cloudflare to run:

```bash
npm ci && npm run lint && npm run build
```

Zero GitHub Actions minutes. Update the live build command: `npm run cf:build`.

| Command | Purpose |
|---------|---------|
| `git push origin main` | Auto deploy |
| `npm run cf:deploy` | Manual redeploy |
| `npm run cf:build` | Sync lint into Cloudflare build config |
| `npm run cf:cleanup-runs` | Delete old failed GitHub Actions runs |
| `npm run cf:verify` | Full production health check (URLs + Cloudflare config) |
| `npm run cf:migrate-domain` | Optional: Worker proxy → Pages-native domain (needs DNS token) |

## Project structure

```txt
src/           React app (sections, UI, product data)
public/assets/ Cinematic landing assets (PNG source + optimized WebP)
workers/              worldmind-proxy Worker (custom domain → Pages)
scripts/              Asset optimization + Cloudflare helpers
dist/                 Production build output (deploy this)
wrangler.worker.toml  Worker config (worldmind.tekup.dk custom domain)
```
