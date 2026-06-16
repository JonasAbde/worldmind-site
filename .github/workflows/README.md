# CI/CD

Deploys run on **Cloudflare Pages Git integration** — not GitHub Actions.

| Event | What happens |
|-------|----------------|
| Push to `main` | Cloudflare runs `npm ci && npm run lint && npm run build` and deploys |
| Manual | `npm run cf:deploy` |

GitHub Actions was removed due to account billing lock. Clean up old failed runs with `npm run cf:cleanup-runs`.
