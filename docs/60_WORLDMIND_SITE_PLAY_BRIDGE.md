# WorldMind Site — Play Portal Production Bridge

Repo: `worldmind-site` (marketing + `/play` portal).  
Core: `worldmind-core` `play-server` (`docs/PLAY_API_CONTRACT.md`).

## Architecture

```
Browser → worldmind.tekup.dk (worldmind-proxy Worker)
            ├─ /api/*              → WORLDMIND_CORE_ORIGIN (play-server)
            ├─ /assets/locations|characters|items|ui|showcase/* → core
            ├─ /_worldmind/bridge-health → Worker status JSON
            └─ everything else     → PAGES_ORIGIN (Cloudflare Pages static build)
```

Site marketing assets (`/assets/optimized/*`, hero PNGs, etc.) stay on **Pages**.  
Play textures and portraits use **core** asset prefixes above.

## Environment

### Worker (`wrangler.worker.toml`)

| Variable | Required | Description |
|----------|----------|-------------|
| `WORLDMIND_CORE_ORIGIN` | **Yes** (secret) | Play-server base URL, no trailing slash. Example: `https://play.example.com` or tunnel URL. |
| `PAGES_ORIGIN` | No (var) | Defaults to `https://worldmind-site.pages.dev` |

```bash
wrangler secret put WORLDMIND_CORE_ORIGIN -c wrangler.worker.toml
# e.g. https://your-play-server.example.com
```

On core, set CORS when the portal calls core **directly** (not via Worker same-origin):

```bash
WM_CORS_ORIGIN=https://worldmind.tekup.dk npm run play:server
```

### Pages build

**Recommended:** leave `VITE_WORLDMIND_CORE_URL` unset so the portal uses same-origin `/api/*` through the Worker.

Optional override (same host):

```env
VITE_WORLDMIND_CORE_URL=https://worldmind.tekup.dk
```

Local dev (Vite proxies `/api` + core `/assets/*` to `127.0.0.1:8080`):

```env
# optional — omit for same-origin via Vite proxy
# VITE_WORLDMIND_CORE_URL=http://127.0.0.1:8080
```

```bash
# Terminal 1 — core
WM_CORS_ORIGIN=http://localhost:5173 npm run play:server

# Terminal 2 — site
npm run dev
# http://localhost:5173/play
```

## Health checks

| Endpoint | Purpose |
|----------|---------|
| `GET /_worldmind/bridge-health` | Worker bridge config (is `WORLDMIND_CORE_ORIGIN` set?) |
| `GET /api/health` | Proxied play-server health (`ok`, `apiVersion`) |
| `GET /api/state` | Full state; 3D client needs `visualCues` |

## Move commands + walkAnimation

`POST /api/command` with `{ "text": "move market" }` should return `result.walkAnimation` with `waypoints[]`.  
Production uses same-origin fetches (no CORS). Dev uses Vite proxy — do not point `VITE_WORLDMIND_CORE_URL` at core unless `WM_CORS_ORIGIN` includes the Vite origin.

## Verification

```bash
npm run verify:production
# or
WORLDMIND_VERIFY_URL=https://worldmind.tekup.dk npm run verify:production
WORLDMIND_VERIFY_SKIP_CF=1 npm run verify:production   # skip Cloudflare API checks
```

Deploy Worker after changing `workers/worldmind-proxy.js`:

```bash
npm run deploy:worker
```

## Caching

Proxied core assets get `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` when upstream omits cache headers.  
Pages `_headers` still applies long-cache for site `/assets/*`.
