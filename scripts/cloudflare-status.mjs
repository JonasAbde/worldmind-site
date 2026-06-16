import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
const PROJECT_NAME = 'worldmind-site'
const CUSTOM_DOMAIN = 'worldmind.tekup.dk'
const ZONE_NAME = 'tekup.dk'

function getWranglerToken() {
  const configPath = path.join(
    os.homedir(),
    'AppData',
    'Roaming',
    'xdg.config',
    '.wrangler',
    'config',
    'default.toml',
  )
  const raw = fs.readFileSync(configPath, 'utf8')
  const match = raw.match(/oauth_token\s*=\s*"([^"]+)"/)
  if (!match) throw new Error('Could not read wrangler oauth token')
  return match[1]
}

async function cfFetch(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors ?? data, null, 2))
  }
  return data
}

async function main() {
  const token = getWranglerToken()

  console.log('=== Cloudflare Pages status ===\n')

  const project = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
  )
  console.log(`Project: ${project.result.name}`)
  console.log(`Subdomain: https://${project.result.subdomain}`)
  console.log(`Production branch: ${project.result.production_branch ?? 'n/a'}`)

  const domains = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
  )
  console.log('\nCustom domains:')
  for (const d of domains.result ?? []) {
    console.log(`  - ${d.name}: ${d.status}`)
  }

  const deployments = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=3`,
  )
  console.log('\nRecent deployments:')
  for (const dep of deployments.result ?? []) {
    console.log(`  - ${dep.environment} | ${dep.url} | ${dep.latest_stage?.status ?? dep.stage}`)
  }

  try {
    const workerDomains = await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains`,
    )
    const host = workerDomains.result?.find((d) => d.hostname === CUSTOM_DOMAIN)
    console.log('\nWorker custom domain (production routing):')
    if (host) {
      console.log(`  - ${host.hostname} → ${host.service} (enabled: ${host.enabled})`)
    } else {
      console.log(`  - ${CUSTOM_DOMAIN}: not attached (run npm run deploy:worker)`)
    }
  } catch {
    console.log('\nWorker custom domain: (could not query)')
  }

  const zones = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}`,
  )
  const zone = zones.result?.[0]
  if (zone) {
    try {
      const records = await cfFetch(
        token,
        `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records?name=${CUSTOM_DOMAIN}`,
      )
      console.log(`\nDNS for ${CUSTOM_DOMAIN}:`)
      if (!records.result?.length) {
        console.log('  (no record — run npm run cf:dns or add CNAME in dashboard)')
      } else {
        for (const r of records.result) {
          console.log(`  - ${r.type} ${r.name} → ${r.content} (proxied: ${r.proxied})`)
        }
      }
    } catch {
      console.log(`\nDNS for ${CUSTOM_DOMAIN}: (token lacks Zone DNS read)`)
      console.log('  Add manually: CNAME worldmind → worldmind-site.pages.dev (proxied)')
    }
  }

  console.log('\n=== Live URLs ===')
  console.log(`  https://${PROJECT_NAME}.pages.dev`)
  console.log(`  https://${CUSTOM_DOMAIN}`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
