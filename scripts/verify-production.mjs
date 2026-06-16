#!/usr/bin/env node
/**
 * Production bridge verification for worldmind.tekup.dk (or WORLDMIND_VERIFY_URL).
 *
 * Checks:
 * - Marketing shell loads
 * - Worker bridge health
 * - GET /api/health
 * - GET /api/state includes visualCues
 * - POST /api/command move returns walkAnimation (when core is live)
 * - Sample core asset returns 200
 * - Site marketing asset still served from Pages (not core proxy collision)
 */

const BASE = (process.env.WORLDMIND_VERIFY_URL ?? 'https://worldmind.tekup.dk').replace(/\/$/, '')
const SKIP_CF = process.env.WORLDMIND_VERIFY_SKIP_CF === '1'

const checks = []

function record(name, ok, detail = '') {
  checks.push({ name, ok, detail })
  console.log(`${ok ? 'OK' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function fetchJson(path, init) {
  const res = await fetch(`${BASE}${path}`, init)
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    // non-json body
  }
  return { res, text, json }
}

async function verifySiteShell() {
  const res = await fetch(BASE, { redirect: 'follow' })
  const text = await res.text()
  const ok =
    res.status === 200 &&
    text.includes('WorldMind') &&
    (text.includes('worldmind-hero-key-art') || text.includes('Enter the Simulation'))
  record('site shell', ok, `status ${res.status}`)
}

async function verifyBridgeHealth() {
  const { res, json } = await fetchJson('/_worldmind/bridge-health')
  const ok = res.status === 200 && json?.bridge === 'worldmind-proxy'
  record('bridge health', ok, json?.coreConfigured ? 'core configured' : 'core not configured')
  return json
}

async function verifyApiHealth() {
  const { res, json } = await fetchJson('/api/health')
  const ok = res.status === 200 && json?.ok === true
  record('GET /api/health', ok, json?.version ?? json?.apiVersion ?? `status ${res.status}`)
  return ok
}

async function verifyStateVisualCues() {
  const { res, json } = await fetchJson('/api/state')
  const visualCues = json?.visualCues
  const ok =
    res.status === 200 &&
    json?.ok === true &&
    visualCues?.kind &&
    Array.isArray(visualCues.locations) &&
    visualCues.locations.length > 0
  record(
    'GET /api/state visualCues',
    ok,
    ok ? `${visualCues.locations.length} locations` : `status ${res.status}`,
  )
  return { ok, visualCues }
}

async function verifyMoveWalkAnimation() {
  const { res, json } = await fetchJson('/api/command', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'move market' }),
  })
  const animation = json?.result?.walkAnimation
  const ok =
    res.status === 200 &&
    json?.ok === true &&
    animation &&
    Array.isArray(animation.waypoints) &&
    animation.waypoints.length > 0
  record(
    'POST /api/command move walkAnimation',
    ok,
    ok ? `${animation.waypoints.length} waypoints` : `status ${res.status}`,
  )
}

async function verifyCoreAsset(visualCues) {
  const loc = visualCues?.locations?.find((l) => l.modelUrl) ?? visualCues?.locations?.find((l) => l.sceneTexture) ?? visualCues?.locations?.[0]
  const modelPath = loc?.modelUrl
  if (modelPath) {
    const normalized = modelPath.startsWith('/') ? modelPath : `/${modelPath}`
    const res = await fetch(`${BASE}${normalized}`, { redirect: 'follow' })
    const ok = res.status === 200
    const ct = res.headers.get('content-type') ?? ''
    record('core 3d model', ok && ct.includes('gltf'), `${normalized} (${res.status}, ${ct})`)
  }
  const assetPath = loc?.sceneTexture ?? '/assets/locations/cafe.png'
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
  const res = await fetch(`${BASE}${normalized}`, { redirect: 'follow' })
  const ok = res.status === 200
  record('core scene texture', ok, `${normalized} (${res.status})`)
}

async function verifySiteAsset() {
  const res = await fetch(`${BASE}/assets/optimized/worldmind-hero-key-art.webp`, { redirect: 'follow' })
  const ok = res.status === 200
  record('site marketing asset', ok, `status ${res.status}`)
}

async function verifyCloudflareConfig() {
  if (SKIP_CF) {
    console.log('SKIP Cloudflare API checks (WORLDMIND_VERIFY_SKIP_CF=1)')
    return
  }

  try {
    const { ACCOUNT_ID, PROJECT_NAME, cfFetch } = await import('./cf-token.mjs')

    const project = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
    )
    const deployments = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=1`,
    )
    const workerDomains = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains`,
    )
    const worker = workerDomains.result?.find((d) => d.hostname === new URL(BASE).hostname)

    const latest = deployments.result?.[0]
    const stage = latest?.latest_stage?.status
    const pagesOk = stage === 'success' || stage === 'active'
    const gitOk = project.result.source?.type === 'github'
    const workerOk = worker?.enabled === true
    const buildOk = project.result.build_config?.build_command?.includes('npm run lint')

    record('Pages deploy', pagesOk, latest?.url ?? 'n/a')
    record('Git source', gitOk)
    record('Worker domain', workerOk, new URL(BASE).hostname)
    record('Lint in build', buildOk)
  } catch (err) {
    record('Cloudflare API', false, err instanceof Error ? err.message : String(err))
  }
}

console.log(`Verifying ${BASE}\n`)

await verifySiteShell()
const bridge = await verifyBridgeHealth()
const apiOk = await verifyApiHealth()
let stateResult = { ok: false, visualCues: null }
if (apiOk) {
  stateResult = await verifyStateVisualCues()
  if (stateResult.ok) {
    await verifyMoveWalkAnimation()
    await verifyCoreAsset(stateResult.visualCues)
  }
} else if (!bridge?.coreConfigured) {
  record('GET /api/state visualCues', false, 'skipped — WORLDMIND_CORE_ORIGIN not set')
  record('POST /api/command move walkAnimation', false, 'skipped — core offline')
  record('core asset', false, 'skipped — core offline')
}
await verifySiteAsset()
await verifyCloudflareConfig()

const required = bridge?.coreConfigured
  ? checks.filter((c) => !c.name.startsWith('Cloudflare') && c.name !== 'bridge health')
  : checks.filter((c) =>
      ['site shell', 'bridge health', 'site marketing asset'].includes(c.name) ||
      c.name.startsWith('Cloudflare'),
    )

const allOk = required.every((c) => c.ok)
if (!allOk) {
  console.log('\nProduction verification failed.')
  process.exit(1)
}

console.log('\nProduction verification passed.')
