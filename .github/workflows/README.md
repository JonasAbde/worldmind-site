# CI/CD

This repo deploys via **Cloudflare Pages Git integration** — not GitHub Actions.

Every push to `main` triggers a Cloudflare build (`npm ci && npm run build`) and production deploy automatically.

Manual fallback:

```bash
npm run deploy
```

Setup (one-time): `npm run cf:git`
