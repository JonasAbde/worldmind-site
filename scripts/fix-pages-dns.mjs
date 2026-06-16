import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
const PROJECT_NAME = 'worldmind-site'
const CUSTOM_DOMAIN = 'worldmind.tekup.dk'
const ZONE_NAME = 'tekup.dk'
const PAGES_TARGET = `${PROJECT_NAME}.pages.dev`

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

function getToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN
  return getWranglerToken()
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
  const token = getToken()

  const domains = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
  )
  const domain = domains.result?.find((d) => d.name === CUSTOM_DOMAIN)
  console.log('Pages domain:', JSON.stringify(domain, null, 2))

  const zones = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}`,
  )
  const zone = zones.result?.[0]
  if (!zone) throw new Error(`Zone not found: ${ZONE_NAME}`)
  console.log(`\nZone: ${zone.name} (${zone.id})`)

  let records
  try {
    records = await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records?name=${CUSTOM_DOMAIN}`,
    )
  } catch (error) {
    console.error('\nDNS list failed (token may lack Zone DNS permissions):', error.message)
    console.log(`\nManual fix in Cloudflare DNS for ${ZONE_NAME}:`)
    console.log(`  Type: CNAME`)
    console.log(`  Name: worldmind`)
    console.log(`  Target: ${PAGES_TARGET}`)
    console.log(`  Proxy: ON (orange cloud)`)
    return
  }

  if (!records.result?.length) {
    console.log(`\nNo DNS record for ${CUSTOM_DOMAIN} — creating CNAME...`)
    const created = await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records`,
      {
        method: 'POST',
        body: JSON.stringify({
          type: 'CNAME',
          name: 'worldmind',
          content: PAGES_TARGET,
          proxied: true,
          ttl: 1,
        }),
      },
    )
    console.log('Created:', created.result.type, created.result.name, '→', created.result.content)
  } else {
    for (const r of records.result) {
      console.log(`\nExisting DNS: ${r.type} ${r.name} → ${r.content} (proxied: ${r.proxied})`)
      if (r.type === 'CNAME' && r.content !== PAGES_TARGET) {
        console.log(`Updating CNAME target to ${PAGES_TARGET}...`)
        await cfFetch(
          token,
          `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records/${r.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ content: PAGES_TARGET, proxied: true }),
          },
        )
        console.log('Updated.')
      }
    }
  }

  console.log('\nRe-check domain status in a few minutes: npm run cf:status')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
