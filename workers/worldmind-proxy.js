const DEFAULT_PAGES_ORIGIN = 'https://worldmind-site.pages.dev'

/** Play-server asset prefixes (site marketing assets stay on Pages). */
const CORE_ASSET_PREFIXES = [
  '/assets/locations/',
  '/assets/characters/',
  '/assets/items/',
  '/assets/ui/',
  '/assets/showcase/',
  '/assets/models/',
  '/assets/audio/',
]

/** Paths forwarded to worldmind-core play-server (not Pages). */
function isCorePath(pathname) {
  if (pathname.startsWith('/api/')) return true
  return CORE_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isCoreAssetPath(pathname) {
  return CORE_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/_worldmind/bridge-health') {
      return bridgeHealth(env)
    }

    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return corsPreflight(request)
    }

    if (isCorePath(url.pathname)) {
      const upstream = await proxy(request, env.WORLDMIND_CORE_ORIGIN, { requireOrigin: true })
      if (isCoreAssetPath(url.pathname) && upstream.ok) {
        return withAssetCaching(url.pathname, upstream)
      }
      return upstream
    }

    return proxy(request, env.PAGES_ORIGIN ?? DEFAULT_PAGES_ORIGIN, { pagesHost: true })
  },
}

function bridgeHealth(env) {
  const coreConfigured = Boolean(env.WORLDMIND_CORE_ORIGIN)
  let coreOriginValid = false
  if (coreConfigured) {
    try {
      new URL(env.WORLDMIND_CORE_ORIGIN)
      coreOriginValid = true
    } catch {
      coreOriginValid = false
    }
  }

  return json(200, {
    ok: coreConfigured && coreOriginValid,
    bridge: 'worldmind-proxy',
    coreConfigured,
    coreOriginValid,
    pagesOrigin: env.PAGES_ORIGIN ?? DEFAULT_PAGES_ORIGIN,
    routes: {
      api: '/api/* → WORLDMIND_CORE_ORIGIN',
      coreAssets: `${CORE_ASSET_PREFIXES.join(', ')} → WORLDMIND_CORE_ORIGIN`,
      site: 'all other paths → PAGES_ORIGIN',
    },
    env: {
      WORLDMIND_CORE_ORIGIN: 'Worker secret — wrangler secret put WORLDMIND_CORE_ORIGIN -c wrangler.worker.toml',
      PAGES_ORIGIN: 'Optional var in wrangler.worker.toml',
    },
  })
}

function corsPreflight(request) {
  const origin = request.headers.get('Origin')
  const headers = {
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  }
  if (origin) {
    headers['access-control-allow-origin'] = origin
  }
  return new Response(null, { status: 204, headers })
}

async function proxy(request, originBase, { requireOrigin = false } = {}) {
  if (!originBase) {
    if (requireOrigin) {
      return json(503, {
        ok: false,
        error: 'play API not configured (WORLDMIND_CORE_ORIGIN)',
        hint: 'wrangler secret put WORLDMIND_CORE_ORIGIN -c wrangler.worker.toml',
      })
    }
    return json(502, { ok: false, error: 'PAGES_ORIGIN not configured' })
  }

  let origin
  try {
    origin = new URL(originBase)
  } catch {
    return json(500, { ok: false, error: 'invalid upstream origin' })
  }

  const target = new URL(request.url)
  target.protocol = origin.protocol
  target.hostname = origin.hostname
  target.port = origin.port

  const headers = new Headers(request.headers)
  headers.set('Host', origin.host)

  const upstream = await fetch(
    new Request(target.toString(), {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual',
    }),
  )

  const outHeaders = new Headers(upstream.headers)
  if (request.headers.get('Origin') && target.pathname.startsWith('/api/')) {
    outHeaders.set('access-control-allow-origin', request.headers.get('Origin'))
    outHeaders.set('vary', 'Origin')
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  })
}

function withAssetCaching(pathname, response) {
  const headers = new Headers(response.headers)
  if (!headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=86400, stale-while-revalidate=604800')
  }
  if (!headers.has('x-worldmind-asset')) {
    headers.set('x-worldmind-asset', pathname)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
