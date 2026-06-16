# CI/CD

Production deploys via **Cloudflare Pages Git integration** (not GitHub Actions).

| Event | Action |
|-------|--------|
| Push to `main` | Cloudflare runs `npm ci && npm run lint && npm run build` and deploys |
| Manual redeploy | `npm run cf:deploy` |
| Health check | `npm run cf:verify` |

GitHub Actions was removed (account billing lock). Old failed runs can be cleaned with `npm run cf:cleanup-runs`.
