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

One-time setup:

```bash
npm run cf:login
npm run cf:init      # creates worldmind-site Pages project
npm run cf:domain    # attaches worldmind.tekup.dk
```

Deploy production:

```bash
npm run deploy:cf
```

Check custom domain status:

```bash
node scripts/check-pages-domain.mjs
```

### CI/CD

GitHub Actions runs on every push to `main`:

- **CI:** lint + build
- **Deploy:** build + `wrangler pages deploy` to Cloudflare Pages

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` — API token with **Cloudflare Pages Edit**
- `CLOUDFLARE_ACCOUNT_ID` — `1cd2e6c70a2918567a3edcf8eadd7458`

## Project structure

```txt
src/           React app (sections, UI, product data)
public/assets/ Cinematic landing assets (PNG source + optimized WebP)
scripts/       Asset optimization + Cloudflare helpers
dist/          Production build output (deploy this)
```
