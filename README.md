# WorldMind Site

Premium cinematic product landing + play portal for **WorldMind — Enter the Simulation**.

This is a separate frontend project (`worldmind-site`) and does not modify the game engine repository.

## Stack

- Vite
- React + TypeScript
- Tailwind CSS (v4 via `@tailwindcss/vite`)
- Framer Motion

## Product truth covered

- WorldMind is a simulation-first AI game (not an NPC chatbot)
- Current product baseline: **WorldMind v1.0-rc7**
- New Aarhus District 01
- The Missing Delivery vertical slice
- 14 player commands
- 3 resolution paths
- Leno companion with evidence guard
- Live Web Play UI, Save Browser, Branch Restore, Snapshot Diff
- Event Log as source of truth
- 188/188 tests passing in core repo

## Development

Install dependencies:

```bash
npm install
```

Run local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deploy

The project outputs static assets to `dist/` and can be deployed on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3/CloudFront, etc.).

Typical flow:

```bash
npm run build
```

Then upload/publish the `dist/` folder to your host.
