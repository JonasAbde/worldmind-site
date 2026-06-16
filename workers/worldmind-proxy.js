const DEFAULT_PAGES_ORIGIN = 'https://worldmind-site.pages.dev'

/** Paths forwarded to worldmind-core play-server (not Pages). */
function isCorePath(pathname) {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/locations/')
  )
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (isCorePath(url.pathname)) {
      return proxy(request, env.WORLDMIND_CORE_ORIGIN, { requireOrigin: true })
    }

    return proxy(request, env.PAGES_ORIGIN ?? DEFAULT_PAGES_ORIGIN, { pagesHost: true })
  },
}

async function proxy(request, originBase, { requireOrigin = false } = {}) {
  if (!originBase) {
    if (requireOrigin) {
      return json(503, {
        ok: false,
        error: 'play API not configured (WORLDMIND_CORE_ORIGIN)',
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

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: upstream.headers,
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
