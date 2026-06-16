import { ACCOUNT_ID, PROJECT_NAME, cfFetch } from './cf-token.mjs'

const URLS = [
  'https://worldmind-site.pages.dev',
  'https://worldmind.tekup.dk',
]

const checks = []

async function checkUrl(url) {
  const res = await fetch(url, { redirect: 'follow' })
  const text = await res.text()
  const ok =
    res.status === 200 &&
    text.includes('WorldMind') &&
    (text.includes('worldmind-hero-key-art') || text.includes('Enter the Simulation'))
  checks.push({ url, status: res.status, ok })
  console.log(`${ok ? 'OK' : 'FAIL'} ${url} (${res.status})`)
}

for (const url of URLS) {
  await checkUrl(url)
}

const project = await cfFetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
)
const deployments = await cfFetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=1`,
)
const workerDomains = await cfFetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains`,
)
const worker = workerDomains.result?.find((d) => d.hostname === 'worldmind.tekup.dk')

const latest = deployments.result?.[0]
const stage = latest?.latest_stage?.status
const pagesOk = stage === 'success' || stage === 'active'
const gitOk = project.result.source?.type === 'github'
const workerOk = worker?.enabled === true
const buildOk = project.result.build_config?.build_command?.includes('npm run lint')

console.log(`\nPages deploy: ${pagesOk ? 'OK' : 'FAIL'} (${latest?.url ?? 'n/a'})`)
console.log(`Git source: ${gitOk ? 'OK' : 'FAIL'}`)
console.log(`Worker domain: ${workerOk ? 'OK' : 'FAIL'}`)
console.log(`Lint in build: ${buildOk ? 'OK' : 'FAIL'}`)

const allOk = checks.every((c) => c.ok) && pagesOk && gitOk && workerOk && buildOk
if (!allOk) process.exit(1)
console.log('\nProduction verification passed.')
